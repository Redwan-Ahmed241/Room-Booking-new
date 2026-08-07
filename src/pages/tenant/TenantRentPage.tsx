"use client";

import { useState, useEffect } from "react";
import { CreditCard, Calendar, AlertTriangle, CheckCircle, Clock, PoundSterling, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTenantRent } from "../../hooks/useTenantRent";
import { stripeApi } from "../../lib/api";

export default function TenantRentPage() {
  const { schedules, reminders, isLoading, refetch } = useTenantRent();
  const [payingId, setPayingId] = useState<number | null>(null);

  // Handle Stripe redirect return
  useEffect(() => {
    let params = new URLSearchParams(window.location.search);
    let sessionId = params.get('stripe_session_id') || params.get('session_id');

    if (!sessionId && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      params = new URLSearchParams(hashQuery);
      sessionId = params.get('stripe_session_id') || params.get('session_id');
    }
    
    if (sessionId) {
      stripeApi.verifySuccess(sessionId)
        .then(async (res) => {
          if (res.success) {
            toast.success("Payment confirmed! Thank you.");
            await refetch();
          }
        })
        .catch((err) => {
          console.error("Payment verification error:", err);
          toast.error(err.message || "Payment verification failed.");
        })
        .finally(() => {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, '', cleanUrl);
        });
    }
  }, [refetch]);

  const handlePayNow = async (paymentId: number) => {
    setPayingId(paymentId);
    try {
      const currentUrl = window.location.origin + window.location.pathname;
      const successUrl = `${currentUrl}?stripe_session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = currentUrl;
      const res = await stripeApi.createCheckoutSession(paymentId, successUrl, cancelUrl);
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
      }
    } catch (err: any) {
      toast.error(err.message || "Could not start payment.");
    } finally {
      setPayingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white/40 mx-auto" />
          <p className="text-sm text-white/40">Loading rent details…</p>
        </div>
      </div>
    );
  }

  const activeSchedule = schedules.find((s: any) => s.status === "active") || schedules[0];
  const overdueReminders = reminders.filter((r: any) => r.isOverdue);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Rent & Payments</h1>
        <p className="text-white/40 text-sm mt-1">
          Manage your rent schedules, payment history, and make payments.
        </p>
      </div>

      {/* Overdue Banner */}
      {overdueReminders.length > 0 && (
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-300">Action Required: Overdue Rent</p>
            <p className="text-xs text-red-400/60 mt-0.5">
              You have {overdueReminders.length} overdue payment{overdueReminders.length > 1 ? "s" : ""}. Please settle your balance as soon as possible.
            </p>
          </div>
        </div>
      )}

      {/* Current Rent Overview */}
      {activeSchedule ? (
        <div
          className="rounded-xl p-6"
          style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Active Schedule</span>
              <h2 className="text-xl font-bold text-white mt-1">{activeSchedule.room_name}</h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-white/40">Monthly Rent</span>
              <p className="text-2xl font-bold text-emerald-400">£{Number(activeSchedule.monthly_rent).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
              <Calendar className="w-4 h-4 text-white/40 mb-1" />
              <p className="text-xs text-white/40">Due Day</p>
              <p className="text-sm font-medium text-white">{activeSchedule.due_day}th of every month</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
              <Clock className="w-4 h-4 text-white/40 mb-1" />
              <p className="text-xs text-white/40">Start Date</p>
              <p className="text-sm font-medium text-white">
                {new Date(activeSchedule.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
              <CreditCard className="w-4 h-4 text-white/40 mb-1" />
              <p className="text-xs text-white/40">Status</p>
              <p className="text-sm font-medium text-emerald-400 capitalize">{activeSchedule.status}</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}
        >
          <CreditCard className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <h3 className="text-base font-medium text-white/60">No Active Rent Schedule</h3>
          <p className="text-sm text-white/30 mt-1 max-w-sm mx-auto">
            You don't currently have an active rent schedule set up.
          </p>
        </div>
      )}

      {/* Payment History */}
      {activeSchedule && activeSchedule.payment_history && activeSchedule.payment_history.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="p-5 border-b border-white/10">
            <h3 className="text-base font-semibold text-white">Payment History</h3>
          </div>

          <div className="divide-y divide-white/5">
            {activeSchedule.payment_history.map((payment: any) => {
              const isPaid = payment.status === "paid";
              const isOverdue = payment.status === "overdue";

              return (
                <div key={payment.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isPaid ? "bg-emerald-500/10 text-emerald-400" :
                      isOverdue ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {isPaid ? <CheckCircle className="w-5 h-5" /> :
                       isOverdue ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Due {new Date(payment.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      {payment.paid_date && (
                        <p className="text-xs text-white/40">
                          Paid on {new Date(payment.paid_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">£{Number(payment.amount).toLocaleString()}</p>
                      <span className={`inline-block text-xs font-medium capitalize px-2 py-0.5 rounded-full ${
                        isPaid ? "text-emerald-400 bg-emerald-500/10" :
                        isOverdue ? "text-red-400 bg-red-500/10" : "text-amber-400 bg-amber-500/10"
                      }`}>
                        {payment.status}
                      </span>
                    </div>

                    {(!isPaid) && (
                      <button
                        onClick={() => handlePayNow(payment.id)}
                        disabled={payingId === payment.id}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
                      >
                        {payingId === payment.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <PoundSterling className="w-3.5 h-3.5" />
                        )}
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
