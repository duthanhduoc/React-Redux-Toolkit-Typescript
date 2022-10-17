import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { PostType } from 'types/blog.type'
import http from 'utils/http'

export interface BlogState {
  postList: PostType[]
  editingPost: null | PostType
  loading: boolean
  currentRequestId: undefined | string
}
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

const initialState: BlogState = {
  postList: [],
  editingPost: null,
  loading: false,
  currentRequestId: undefined
}

export const getPostList = createAsyncThunk('blogs/getPostList', async (_, thunkAPI) => {
  const response = await http.get<PostType[]>('posts', {
    signal: thunkAPI.signal
  })
  return response.data
})

export const addPost = createAsyncThunk('blogs/addPost', async (body: Omit<PostType, 'id'>, thunkAPI) => {
  const response = await http.post<PostType>('posts', body, {
    signal: thunkAPI.signal
  })
  return response.data
})

export const deletePost = createAsyncThunk('blogs/deletePost', async (postId: string, thunkAPI) => {
  const response = await http.delete<{}>(`posts/${postId}`, {
    signal: thunkAPI.signal
  })
  return response.data
})

export const updatePost = createAsyncThunk(
  'blogs/updatePost',
  async ({ postId, body }: { postId: string; body: Omit<PostType, 'id'> }, thunkAPI) => {
    try {
      const response = await http.put<PostType>(`posts/${postId}`, body, {
        signal: thunkAPI.signal
      })
      return response.data
    } catch (error: any) {
      if (error.name === 'AxiosError' && error.response.status === 422) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
      throw error
    }
  }
)

export const blogSlice = createSlice({
  name: 'blog', // prefix để generate ra action
  initialState,
  reducers: {
    startEditPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      const foundPost = state.postList.find((post) => post.id === postId) || null
      state.editingPost = foundPost
    },
    cancelEditPost: (state) => {
      state.editingPost = null
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload)
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.meta.arg
        const deletePostIndex = state.postList.findIndex((post) => post.id === postId)
        if (deletePostIndex !== -1) {
          state.postList.splice(deletePostIndex, 1)
        }
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.postList.find((post, index) => {
          if (post.id === action.payload.id) {
            state.postList[index] = action.payload
            return true
          }
          return false
        })
        state.editingPost = null
      })
      .addMatcher<PendingAction>(
        (action) => {
          return action.type.endsWith('/pending')
        },
        (state, action) => {
          state.loading = true
          state.currentRequestId = action.meta.requestId
        }
      )
      .addMatcher<RejectedAction>(
        (action) => {
          return action.type.endsWith('/rejected')
        },
        (state, action) => {
          if (state.loading && state.currentRequestId === action.meta.requestId) {
            state.loading = false
            state.currentRequestId = undefined
          }
        }
      )
      .addMatcher<FulfilledAction>(
        (action) => {
          return action.type.endsWith('/fulfilled')
        },
        (state, action) => {
          if (state.loading && state.currentRequestId === action.meta.requestId) {
            state.loading = false
            state.currentRequestId = undefined
          }
        }
      )
  }
})

export const { startEditPost, cancelEditPost } = blogSlice.actions

const blogReducer = blogSlice.reducer

export default blogReducer
