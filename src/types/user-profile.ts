import type { User } from "./user";

export interface Trainee {
	id: number;
	userId: number;
	gender: string | null;
	idNumber: string | null;
	address: string | null;
	birthDate: string | null;
	photoUrl: string | null;
	photoPath: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface Instructor {
	id: number;
	userId: number;
	phonenumber: string | null;
	occupation: string | null;
	gender: string | null;
	address: string | null;
	title: string | null;
	experience: string | null;
	expertise: string | null;
	detail: string | null;
	photoUrl: string | null;
	photoPath: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface Student {
	id: number;
	userId: number;
	phonenumber: string | null;
	occupation: string | null;
	gender: string | null;
	address: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface UserProfile {
	user: User;
	trainee?: Trainee | null;
	instructor?: Instructor | null;
	courses: {
		id: number,
		instructor: string,
		title: string,
		slug: string,
		lessonCount: number,
		practiceCount: number,
		imageUrl: string,
		category: string,
		is_open: boolean,
		is_recommended: boolean
	}[]
}