import { useQuery } from "@tanstack/react-query";
import { tenantRentApi } from "../lib/tenantApi";

export const TENANT_RENT_QUERY_KEY = ["tenantRent"];

export function useTenantRent() {
  const query = useQuery({
    queryKey: TENANT_RENT_QUERY_KEY,
    queryFn: async () => {
      const [schedules, reminders] = await Promise.all([
        tenantRentApi.mySchedules().catch(() => []),
        tenantRentApi.myReminders().catch(() => []),
      ]);
      return { schedules, reminders };
    },
  });

  return {
    schedules: query.data?.schedules || [],
    reminders: query.data?.reminders || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
