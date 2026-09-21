"use client"

import {
   Card,
   CardHeader,
   CardTitle,
   CardContent,
} from "@/components/ui/card"

import { useActionState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { loginAction } from "@/actions/auth"
import { useRouter } from "next/navigation"

export function LoginForm() {
   type LoginActionState = {
      success: boolean
      message?: string
      redirectTo?: string
      error?: string
   }

   const [state, formAction, isPending] = useActionState<LoginActionState | null, FormData>(
      loginAction as (
         state: LoginActionState | null,
         formData: FormData,
      ) => Promise<LoginActionState | null>,
      null,
   )
   const router = useRouter()

   useEffect(() => {
     if(state?.success && state?.redirectTo){
      router.replace(state?.redirectTo)
     }
   }, [state, router])
   
   return (
       <Card className="bg-app-card border border-app-border w-full max-w-md mx-auto">
          <CardHeader>
             <CardTitle className="text-white text-center text-3xl sm:text-4xl font-bold">
               Dev<span className="text-brand-primary">Pizza</span>
             </CardTitle>
          </CardHeader>
          <CardContent>
             <form className="space-y-4" action={formAction}>

                
                <div className="space-y-2">
                     <Label htmlFor="email" className="text-white">
                        Email
                     </Label>
                     <Input 
                     type="email"
                     id="email" 
                     name="email"
                     placeholder="Digite seu email"
                     required
                     minLength={3}
                     className="text-white bg-app-background border-app-border"
                     />
                </div>

                <div className="space-y-2">
                     <Label htmlFor="password" className="text-white">
                        Senha
                     </Label>
                     <Input 
                     type="password"
                     id="password"
                     name="password"
                     placeholder="Digite sua senha"
                     required
                     minLength={6}
                     className="text-white bg-app-background border-app-border"
                     />
                </div>

                <Button 
                type="submit" 
                className="w-full bg-brand-primary text-white hover:bg-brand-primary"
                disabled={isPending}
                >
                  {isPending ? "Acessando conta..." : "Acessar"}
                </Button>

                {state?.error && (
                  <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                     {state?.error}
                  </div>
                )}

                <p className="text-center text-sm text-gray-100">
                  Ainda não possui uma conta?<Link href="/register" className="text-brand-primary font-semibold"> Cria uma conta</Link>
                </p>

             </form>
          </CardContent>
       </Card>
   )
}

