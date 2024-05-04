interface User {
	id?: number
	name?: string
	email: string
	password: string
}

interface UserWithoutPassword extends Omit<User, 'password'> {}

interface UserLoginType {
	email: string
	password: string
}

interface UserRegisterType extends UserLoginType {
	name: string
}
