import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote, createNote } from "../services/noteService";

type UseNotesMutationsProps = () => void;

export function useNotesMutations(onCloseModal: UseNotesMutationsProps) {
    const queryClient = useQueryClient();

    const { mutate: deleteMutate, variables: deletingId } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    });
    
    const { mutate: createMutate } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCloseModal();
    },
    });
    
    return {
        createNote: createMutate,
        deleteNote: deleteMutate,
        deletingId,
    };
}