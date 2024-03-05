import { createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state
interface AddGrade {
	studentId: string;
	subjectsWithNameAndId: { subjectName: string; id: string }[];
}

// Define the initial state using that type

const initialState: AddGrade = {
	studentId: '',
	subjectsWithNameAndId: [],
};

export const addGradeSlice = createSlice({
	name: 'grade',
	initialState,
	reducers: {
		assignStudentGradeId: (state, action) => {
			state.studentId = action.payload.studentId;
			state.subjectsWithNameAndId = action.payload.subjectsWithNameAndId;
		},
	},
});

// Other code such as selectors can use the imported `RootState` type

export const { assignStudentGradeId } = addGradeSlice.actions;

export default addGradeSlice.reducer;
