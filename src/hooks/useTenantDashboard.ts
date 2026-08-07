import { useQuery } from "@tanstack/react-query";
import { tenantAssignmentApi, tenantRentApi, tenantDocumentApi } from "../lib/tenantApi";

export const TENANT_DASHBOARD_QUERY_KEY = ["tenantDashboard"];

export function useTenantDashboard() {
  const query = useQuery({
    queryKey: TENANT_DASHBOARD_QUERY_KEY,
    queryFn: async () => {
      const [assignData, reminderData, docData] = await Promise.all([
        tenantAssignmentApi.myAssignment().catch(() => ({ assignment: null, room: null })),
        tenantRentApi.myReminders().catch(() => []),
        tenantDocumentApi.list().catch(() => []),
      ]);

      return {
        assignment: assignData.assignment,
        room: assignData.room,
        reminders: reminderData,
        documents: docData,
      };
    },
  });

  return {
    assignment: query.data?.assignment || null,
    room: query.data?.room || null,
    reminders: query.data?.reminders || [],
    documents: query.data?.documents || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
