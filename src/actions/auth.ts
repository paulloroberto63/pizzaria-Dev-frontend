"use server"

import { apiClient } from "@/lib/api"
import { User, AuthResponse } from "@/lib/types"
import { removeToken, setToken } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function registerAction(
    prevState: { success: boolean, message: string, redirectTo?: string } | null,
    formData: FormData
){
    
    try {
        
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    const data = {
        name: name,
        email: email,
        password: password
    }

    await apiClient<User>( "/users", {
       method: "POST",
       body: JSON.stringify(data),
    });

    
    return { success: true,  message: "Conta criada com sucesso!", redirectTo: "/login" }
    } 
    
    catch(error){
      if(error instanceof Error){
        return { success: false, message: error.message }
    }

    return { success: false, message: "Erro ao criar conta" }
}

}

export async function loginAction(
    prevState: { success: boolean, message: string, redirectTo?: string } | null,
    formData: FormData
){
    try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const data = {
        email: email,
        password: password
    }

    const response = await apiClient<AuthResponse>("/session", {
        method: "POST",
        body: JSON.stringify(data),
    })
     
   await setToken(response.token)

    return { success: true, message: "Login realizado com sucesso!", redirectTo: "/dashboard" }
    } catch(error) {
        
        if(error instanceof Error){
            return { success: false, error: error.message || "Erro ao realizar login" }
        }

        return { success: false, error: "Erro ao realizar login" }
    }
}

export async function logoutAction(){
  await removeToken()
  redirect("/login")
}
