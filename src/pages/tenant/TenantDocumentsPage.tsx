"use client";

import { useState } from "react";
import { FileText, Upload, Plus, X, Loader2 } from "lucide-react";
import { useTenantDocuments } from "../../hooks/useTenantDocuments";

const DOC_TYPES = [
  { value: "id", label: "ID Document" },
  { value: "proof_of_address", label: "Proof of Address" },
  { value: "contract", label: "Tenancy Contract" },
  { value: "reference", label: "Reference Letter" },
  { value: "other", label: "Other" },
];

export default function TenantDocumentsPage() {
  const { documents, isLoading, uploadDocument, isUploading } = useTenantDocuments();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", type: "other", description: "" });
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file || !form.name) {
      setError("Please provide a document name and select a file.");
      return;
    }
    setError(null);
    try {
      await uploadDocument({
        file,
        name: form.name,
        type: form.type,
        description: form.description,
      });
      setShowForm(false);
      setForm({ name: "", type: "other", description: "" });
      setFile(null);
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white/40 mx-auto" />
          <p className="text-sm text-white/40">Loading documents…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Your Documents</h1>
          <p className="text-white/40 text-sm mt-1">
            Upload and view your tenancy documents, proof of ID, and address.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Upload Document"}
        </button>
      </div>

      {/* Upload Form Modal/Inline */}
      {showForm && (
        <div
          className="rounded-xl p-6 border space-y-4"
          style={{ background: "var(--surface-1)", borderColor: "var(--border-subtle)" }}
        >
          <h3 className="text-base font-semibold text-white">Upload New Document</h3>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1">Document Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Passport Copy"
                className="w-full h-10 rounded-lg px-3 text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1">Document Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full h-10 rounded-lg px-3 text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-white/30"
              >
                {DOC_TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-neutral-900 text-white">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Description (Optional)</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Valid until 2030"
              className="w-full h-10 rounded-lg px-3 text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Select File *</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-white/50 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading || !file || !form.name}
              className="px-5 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-white/90 disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {isUploading ? "Uploading..." : "Submit Document"}
            </button>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}
        >
          <FileText className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <h3 className="text-base font-medium text-white/60">No Documents Uploaded</h3>
          <p className="text-sm text-white/30 mt-1 max-w-sm mx-auto">
            Upload your ID, proof of address, or other tenancy files to keep them organized.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc: any) => {
            const isApproved = doc.status === "approved";
            const isRejected = doc.status === "rejected";

            return (
              <div
                key={doc.id}
                className="rounded-xl p-5 flex flex-col justify-between"
                style={{ background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-white/60" />
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize shrink-0 ${
                      isApproved ? "text-emerald-400 bg-emerald-500/10" :
                      isRejected ? "text-red-400 bg-red-500/10" : "text-amber-400 bg-amber-500/10"
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white truncate">{doc.name}</h4>
                  <p className="text-xs text-white/40 capitalize mt-0.5">{doc.type.replace("_", " ")}</p>

                  {doc.description && (
                    <p className="text-xs text-white/50 mt-2 line-clamp-2">{doc.description}</p>
                  )}

                  {doc.admin_notes && (
                    <div className="mt-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                      <p className="text-[11px] font-medium text-white/40">Admin Note:</p>
                      <p className="text-xs text-white/70 mt-0.5">{doc.admin_notes}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-white/30">
                    {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString("en-GB") : ""}
                  </span>
                  {doc.file_url && (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline font-medium"
                    >
                      View File →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
