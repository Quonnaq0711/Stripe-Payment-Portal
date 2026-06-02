
"use client"

import { Show, SignInButton, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs"

export function AuthButtons() {
  return (
    <div>
      <Show when="signed-out">
        <SignInButton />
        <SignUpButton />
      </Show>
      <Show when="signed-in">
        <UserButton />
        <SignOutButton />
      </Show>
    </div>
  )
}