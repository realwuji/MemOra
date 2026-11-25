/*
  Teacher logins. Each teacher has a real sign-in account (so a password is needed), on an address
  that cannot belong to anyone (.invalid), and signs in on the /teachers page with their name.
  The portal is not linked from the landing page or the menus.
*/
export const TEACHER_DOMAIN = 'teachers.memoora.invalid'

export const TEACHERS = [
  { name: 'Maths teachers', key: 'mathsteachers' },
  { name: 'Economics teachers', key: 'economicsteachers' },
]

export const teacherEmail = (key) => `${key}@${TEACHER_DOMAIN}`
export const isTeacher = (email) => String(email || '').toLowerCase().endsWith(`@${TEACHER_DOMAIN}`)
