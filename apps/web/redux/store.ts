import { combineReducers, configureStore } from '@reduxjs/toolkit';
import modalSlice from './slices/modalSlice';
import { persistStore, persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import userSlice from './slices/userSlice';
import chatSlice from './slices/chatSlice';
import notificationSlice from './slices/notificationSlice';
import addGradeSlice from './slices/addGradeSlice';

const rootReducer = combineReducers({
	modal: modalSlice,
	user: userSlice,
	chat: chatSlice,
	notification: notificationSlice,
	addGrade: addGradeSlice,
});

const createNoopStorage = () => {
	return {
		getItem(_key) {
			return Promise.resolve(null);
		},
		setItem(_key, value) {
			return Promise.resolve(value);
		},
		removeItem(_key) {
			return Promise.resolve();
		},
	};
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const persistConfig = {
	key: 'root',
	storage,
	blacklist: ['notification'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
