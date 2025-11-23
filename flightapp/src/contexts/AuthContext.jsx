import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  initFirebase,
  onAuthStateChangedListener,
  signInWithGoogle,
  signOutUser,
  getBookmarksForUser,
  saveBookmarkForUser,
  removeBookmarkForUser,
} from '../lib/firebaseClient'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  // initialize firebase and subscribe to auth
  useEffect(() => {
    let unsub = null
    let mounted = true
    async function setup() {
      await initFirebase()
      unsub = await onAuthStateChangedListener(async (u) => {
        if (!mounted) return
        setUser(u)
        if (u) {
          try {
            const bs = await getBookmarksForUser(u.uid)
            setBookmarks(bs || [])
          } catch (e) {
            console.error('Failed to load bookmarks for user', e)
            setBookmarks([])
          }
        } else {
          setBookmarks([])
        }
      })
      setLoading(false)
    }
    setup()
    return () => {
      mounted = false
      if (unsub) unsub()
    }
  }, [])

  const addBookmark = useCallback(async (bookmark) => {
    // create id for bookmark
    const id = bookmark._bookmarkId || bookmark.id || btoa(JSON.stringify(bookmark)).slice(0, 12)
    if (user && user.uid) {
      await saveBookmarkForUser(user.uid, id, { ...bookmark, _bookmarkId: id })
      const bs = await getBookmarksForUser(user.uid)
      setBookmarks(bs || [])
    } else {
      // no localStorage fallback: require signed-in user
      console.error('addBookmark: user not signed in; bookmarks require authentication')
    }
  }, [user])

  const removeBookmark = useCallback(async (bookmark) => {
    const id = bookmark._bookmarkId || bookmark.id || btoa(JSON.stringify(bookmark)).slice(0, 12)
    if (user && user.uid) {
      await removeBookmarkForUser(user.uid, id)
      const bs = await getBookmarksForUser(user.uid)
      setBookmarks(bs || [])
    } else {
      // no localStorage fallback
      console.error('removeBookmark: user not signed in; bookmarks require authentication')
    }
  }, [user])

  const signIn = useCallback(() => signInWithGoogle(), [])
  const signOut = useCallback(() => signOutUser(), [])

  const value = {
    user,
    bookmarks,
    addBookmark,
    removeBookmark,
    signIn,
    signOut,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
