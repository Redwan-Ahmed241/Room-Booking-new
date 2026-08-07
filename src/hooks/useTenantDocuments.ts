import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantDocumentApi } from "../lib/tenantApi";

export const TENANT_DOCUMENTS_QUERY_KEY = ["tenantDocuments"];

export function useTenantDocuments() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: TENANT_DOCUMENTS_QUERY_KEY,
    queryFn: async () => {
      return await tenantDocumentApi.list();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, name, type, description }: { file: File; name: string; type: string; description?: string }) => {
      const url = await tenantDocumentApi.upload(file);
      return await tenantDocumentApi.create({
        name,
        type,
        description,
        file_url: url,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANT_DOCUMENTS_QUERY_KEY });
    },
  });

  return {
    documents: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    uploadDocument: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
  };
}
