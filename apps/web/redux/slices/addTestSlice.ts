import { createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state
interface AddTest {
	testDate: string;
}

// Define the initial state using that type

const initialState: AddTest = {
	testDate: '',
};

export const addTestSlice = createSlice({
	name: 'test',
	initialState,
	reducers: {
		assignTestDate: (state, action) => {
			state.testDate = action.payload;
		},
	},
});

// Other code such as selectors can use the imported `RootState` type

export const { assignTestDate } = addTestSlice.actions;

export default addTestSlice.reducer;
