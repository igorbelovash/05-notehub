import css from "./App.module.css";
import NoteList from "./components/NoteList/NoteList.tsx";
import Pagination from "./components/Pagination/Pagination.tsx";
import SearchBox from "./components/SearchBox/SearchBox.tsx";
import Modal from "./components/Modal/Modal.tsx";
import NoteForm from "./components/NoteForm/NoteForm.tsx";
import type { CreateNote } from "./types/note.ts";
import { fetchNotes } from "./services/noteService.ts";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { useModalControl } from "./hooks/useModalControl.ts";
import { useNotesMutations } from "./hooks/useNotesMutations.ts";

function App() {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { isModalOpen, openModal, closeModal } = useModalControl();
  const { createNote, deleteNote, deletingId } = useNotesMutations(closeModal);

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", search, currentPage],
    queryFn: () => fetchNotes(search, currentPage),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages || 0;

  const handleSearch = useDebouncedCallback((search: string) => {
    setSearch(search);
  }, 1000);

  const handleDelete = (id: string) => {
    deleteNote(id);
  };

  const handleSubmit = (data: CreateNote) => {
    createNote(data);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{error.message}</p>}
      {isSuccess && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSubmit={handleSubmit} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}

export default App;
