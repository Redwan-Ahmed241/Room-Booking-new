import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomsApi, propertyImagesApi } from "../lib/api";
import type { Room } from "../lib/types";

export const ROOMS_QUERY_KEY = ["rooms"];
export const PROPERTY_IMAGES_QUERY_KEY = ["propertyImages"];

export function useRooms(locationFilter?: string) {
  const queryClient = useQueryClient();

  const roomsQuery = useQuery({
    queryKey: locationFilter ? [...ROOMS_QUERY_KEY, locationFilter] : ROOMS_QUERY_KEY,
    queryFn: async () => {
      const response = await roomsApi.getRooms(locationFilter ? { location: locationFilter } : undefined);
      const allRooms: Room[] = response.data || response;
      if (locationFilter) {
        return allRooms.filter((r) => r.location === locationFilter);
      }
      return allRooms;
    },
  });

  const propertyImagesQuery = useQuery({
    queryKey: PROPERTY_IMAGES_QUERY_KEY,
    queryFn: async () => {
      try {
        return await propertyImagesApi.list();
      } catch {
        return [];
      }
    },
  });

  const createRoomMutation = useMutation({
    mutationFn: (roomData: Partial<Room>) => roomsApi.createRoom(roomData as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOMS_QUERY_KEY });
    },
  });

  const updateRoomMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Room> }) => roomsApi.updateRoom(id, data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOMS_QUERY_KEY });
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (id: string) => roomsApi.deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOMS_QUERY_KEY });
    },
  });

  return {
    rooms: roomsQuery.data || [],
    propertyImages: propertyImagesQuery.data || [],
    isLoading: roomsQuery.isLoading || propertyImagesQuery.isLoading,
    isFetching: roomsQuery.isFetching || propertyImagesQuery.isFetching,
    error: roomsQuery.error || propertyImagesQuery.error,
    refetch: () => {
      roomsQuery.refetch();
      propertyImagesQuery.refetch();
    },
    createRoom: createRoomMutation.mutateAsync,
    isCreating: createRoomMutation.isPending,
    updateRoom: updateRoomMutation.mutateAsync,
    isUpdating: updateRoomMutation.isPending,
    deleteRoom: deleteRoomMutation.mutateAsync,
    isDeleting: deleteRoomMutation.isPending,
  };
}
