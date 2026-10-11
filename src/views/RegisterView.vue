<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import { RouterLink, useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'

const authStore = useAuthStore()
const router = useRouter()
const messageStore = useMessageStore()

const validationSchema = yup.object({
  firstname: yup.string().trim().required('The first name is required'),
  lastname: yup.string().trim().required('The last name is required'),
  username: yup.string().trim().required('The username is required'),
  email: yup.string().trim().required('The email is required').email('Input must be an email.'),
  password: yup.string().required('The password is required')
    .min(6, 'The password must be at least 6 characters.'),
  confirmPassword: yup.string().required('Please confirm your password')
    .oneOf([yup.ref('password')], 'The passwords must match'),
})
const { errors, handleSubmit, isSubmitting } = useForm({
  validationSchema,
  initialValues: {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
})
const { value: firstname } = useField<string>('firstname')
const { value: lastname } = useField<string>('lastname')
const { value: username } = useField<string>('username')
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: confirmPassword } = useField<string>('confirmPassword')

const onSubmit = handleSubmit((values) => {
  return authStore.register({
    firstname: values.firstname.trim(),
    lastname: values.lastname.trim(),
    username: values.username.trim(),
    email: values.email.trim(),
    password: values.password,
  }).then(() => {
    router.push({ name: 'event-list-view' })
  }).catch((error) => {
    messageStore.updateMessage(error.response?.status === 409
      ? 'This username is already taken'
      : 'could not register')
    setTimeout(() => {
      messageStore.resetMessage()
    }, 3000)
  })
})
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="@/assets/logo.svg" alt="CAMT" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Create your account
      </h2>
    </div>
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" novalidate @submit.prevent="onSubmit">
        <div>
          <label for="firstname" class="block text-sm font-medium leading-6 text-gray-900">
            First name
          </label>
          <InputText id="firstname" v-model="firstname" placeholder="First name"
            autocomplete="given-name" :error="errors['firstname']" />
        </div>
        <div>
          <label for="lastname" class="block text-sm font-medium leading-6 text-gray-900">
            Last name
          </label>
          <InputText id="lastname" v-model="lastname" placeholder="Last name"
            autocomplete="family-name" :error="errors['lastname']" />
        </div>
        <div>
          <label for="username" class="block text-sm font-medium leading-6 text-gray-900">
            Username
          </label>
          <InputText id="username" v-model="username" placeholder="Username"
            autocomplete="username" :error="errors['username']" />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">
            Email address
          </label>
          <InputText id="email" type="email" v-model="email" placeholder="Email address"
            autocomplete="email" :error="errors['email']" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">
            Password
          </label>
          <InputText id="password" type="password" v-model="password" placeholder="Password"
            autocomplete="new-password" :error="errors['password']" />
        </div>
        <div>
          <label for="confirmPassword" class="block text-sm font-medium leading-6 text-gray-900">
            Confirm password
          </label>
          <InputText id="confirmPassword" type="password" v-model="confirmPassword"
            placeholder="Confirm password" autocomplete="new-password"
            :error="errors['confirmPassword']" />
        </div>
        <div>
          <button type="submit" :disabled="isSubmitting"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50">
            {{ isSubmitting ? 'Signing up...' : 'Sign up' }}
          </button>
        </div>
      </form>
      <p class="mt-10 text-center text-sm text-gray-500">
        Already a member?
        {{ ' ' }}
        <RouterLink :to="{ name: 'login-view' }"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          Sign in here
        </RouterLink>
      </p>
    </div>
  </div>
</template>
