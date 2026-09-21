"use client"
import { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogDescription,
    DialogFooter,
    } from "../ui/dialog"

    import { Button } from "../ui/button"
    import { Plus } from "lucide-react"
    import { Label } from "../ui/label"
    import { Input } from "../ui/input"
    import { createCategoryAction } from "@/actions/categories"
    import { useRouter } from "next/navigation"


export function CategoryForm() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        
        const result = await createCategoryAction(formData)

        if(result.success){
          setIsOpen(false)
          router.refresh()
          return
        } else {
          console.log(result.error)
        }

        
    }
   
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-primary hover:bg-brand-primary font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                Nova categoria
            </Button>
          </DialogTrigger>

          <DialogContent className="p-6 bg-app-card text-white">
            <DialogHeader>
                <DialogTitle>Nova categoria</DialogTitle>
                <DialogDescription>
                    Criando uma nova categoria
                </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleCreateCategory}>
                <div>
                   <Label htmlFor="category" className="mb-2">
                     Nome da categoria
                   </Label>
                   <Input 
                   id="name" 
                   name="name"
                   type="text"
                   required
                   placeholder="Digite o nome da categoria" 
                   className="border-app-border bg-app-background text-white"/>
                </div>

                <Button
                   type="submit"
                   className="w-full bg-brand-primary text-white hover:bg-brand-primary"
                >
                  Criar categoria
                </Button>
            </form>
          </DialogContent>
        </Dialog>
    )
}