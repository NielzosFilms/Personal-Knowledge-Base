const history_length = 6;

export function addNoteToHistory(id) {
    let noteHistory = JSON.parse(localStorage.getItem("noteHistory")) || [];
    let found = noteHistory.indexOf(id);
    if (found !== -1) {
        noteHistory.splice(found, 1);
    }
    noteHistory.unshift(id);
    while (noteHistory.length > history_length) {
        noteHistory.pop();
    }
    localStorage.setItem("noteHistory", JSON.stringify(noteHistory));
}

export function getNoteHistory() {
    let notes = JSON.parse(localStorage.getItem("noteHistory")) || [];
    notes = notes.map((note) => {
        return Number(note);
    });
    return notes;
}
