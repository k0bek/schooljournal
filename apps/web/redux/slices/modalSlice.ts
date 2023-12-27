import { createSlice } from '@reduxjs/toolkit';

export type ModalType = 'login' | 'register' | 'firstNameLastName' | 'verify' | 'updateUser';

// Define a type for the slice state
interface ModalState {
	isOpen: boolean;
	type: ModalType;
}

// Define the initial state using that type

const initialState: ModalState = {
	isOpen: false,
	type: null,
};

export const counterSlice = createSlice({
	name: 'modal',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		onOpen: (state, action) => {
			state.isOpen = true;
			state.type = action.payload;
		},
		onClose: state => {
			state.isOpen = false;
		},
	},
});

export const { onOpen, onClose } = counterSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export default counterSlice.reducer;
