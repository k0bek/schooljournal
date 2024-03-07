import { createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state
interface Classid {
	classId: string;
}

// Define the initial state using that type

const initialState: Classid = {
	classId: '',
};

export const classIdSlice = createSlice({
	name: 'classId',
	initialState,
	reducers: {
		assignClassId: (state, action) => {
			state.classId = action.payload;
		},
	},
});

// Other code such as selectors can use the imported `RootState` type

export const { assignClassId } = classIdSlice.actions;

export default classIdSlice.reducer;
