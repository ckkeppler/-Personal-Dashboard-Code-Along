import { Injectable } from '@angular/core';
import { Bookmark } from './bookmark.model';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  bookmarks?: Bookmark[] = [];

  constructor() {
    this.loadState();
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === 'bookmarks') this.loadState();
    });
  }

  getBookmarks() {
    return this.bookmarks;
  }

  getBookmark(id: string) {
    return this.bookmarks?.find((b) => b.id === id);
  }

  addBookmark(bookmark: Bookmark) {
    this.bookmarks!.push(bookmark);
    this.saveState();
  }

  updateBookmark(id: string, updatedFields: Partial<Bookmark>) {
    const bookmark = this.getBookmark(id);
    Object.assign(bookmark, updatedFields);
    this.saveState();
  }

  deleteBookmark(id: string) {
    const bookmarkIndex = this.bookmarks!.findIndex((b) => b.id === id);
    if (bookmarkIndex === -1) return;
    this.bookmarks!.splice(bookmarkIndex, 1);
    this.saveState();
  }

  saveState() {
    localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
  }

  loadState() {
    try {
      const bookmarksInStorage = JSON.parse(
        localStorage.getItem('bookmarks')!,
        (key, value) => {
          if (key == 'url') return new URL(value);
          return value;
        }
      );
      // if (!bookmarksInStorage) return;
      // clear the bookmarks array while keeping the reference
      this.bookmarks!.length = 0;
      this.bookmarks!.push(...bookmarksInStorage);
    } catch (e) {
      console.log(
        'There was an error retrieving the bookmarks from localStorage'
      );
      console.log(e);
    }
  }
}
