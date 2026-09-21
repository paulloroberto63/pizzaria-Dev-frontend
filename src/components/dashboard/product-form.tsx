"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Plus } from "lucide-react" 
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { createProductAction } from "@/actions/products"
import { useRouter } from "next/navigation"
import { Category } from "@/lib/types"
import Image from "next/image"
import { Upload } from "lucide-react"

interface ProductFormProps {
  categories: Category[]
}

export function ProductForm({ categories }: ProductFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [categoryId, setCategoryId] = useState("")
  const router = useRouter()
  const [priceValue, setPriceValue] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  function convertBRLToCents(value: string): number {
    const digits = value.replace(/[R$\s]/g, "").replace(/\./g, "").replace(",", ".")
    
    const reais = parseFloat(digits) || 0

    return Math.round(reais * 100)
  }

  async function handleCreateProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

   if(!imageFile) {
    return
   }
    
    const formData = new FormData()

    const formElement = event.currentTarget

    const name = (formElement.elements.namedItem("name") as HTMLInputElement)?.value
    const description = (formElement.elements.namedItem("description") as HTMLTextAreaElement)?.value
    const price = convertBRLToCents(priceValue)

    formData.append("name", name)
    formData.append("description", description)
    formData.append("price", price.toString())
    formData.append("category_id", categoryId)
    formData.append("file", imageFile)
    
    const result = await createProductAction(formData)

    if (result.success) {
      setIsOpen(false)
      setCategoryId("")
      setPriceValue("")
      router.refresh()
      return
    } else {
      console.log(result.error)
    }
  }

  function formatToBrl(value: string) {
    const numbers = value.replace(/\D/g, "")
    if (!numbers) return ""
    const amount = parseInt(numbers, 10) / 100
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }


    function handlePriceChange(event: React.ChangeEvent<HTMLInputElement>) {
      setPriceValue(formatToBrl(event.target.value))
    }

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
      const file = event.target.files?.[0]
      if(file) {
        if(file.size > 5 * 1024 * 1024) {
          return
      }
      
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function clearImage() {
    setImagePreview(null)
    setImageFile(null)
  }


   

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-primary hover:bg-brand-primary font-semibold">
          <Plus className="h-4 w-4 mr-2" />
          Novo produto
        </Button>
      </DialogTrigger>

      <DialogContent className="p-6 bg-app-card text-white">
        <DialogHeader>
          <DialogTitle>Novo produto</DialogTitle>
          <DialogDescription>
            Cadastre um novo produto no cardápio
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleCreateProduct}>
          <div>
            <Label htmlFor="name" className="mb-2">
              Nome do produto
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Ex: Pizza Margherita"
              className="border-app-border bg-app-background text-white"
            />
          </div>

          <div>
            <Label htmlFor="price" className="mb-2">
              Preço (R$)
            </Label>
            <Input
              id="price"
              name="price"
              type="text"
              inputMode="numeric"
              required
              placeholder="R$ 0,00"
              className="border-app-border bg-app-background text-white"
              value={priceValue}
              onChange={handlePriceChange}
            />
          </div>

          <div>
            <Label htmlFor="description" className="mb-2">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Descreva o produto"
              className="border-app-border bg-app-background text-white"
            />
          </div>

          <div>
            <Label htmlFor="category_id" className="mb-2">
              Categoria
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger
                id="category_id"
                className="w-full border-app-border bg-app-background text-white"
              >
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-app-card text-white border-app-border">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="text-white hover:bg-transparent cursor-pointer">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="mb-2">
              Imagem do produto
            </Label>
            {imagePreview ? (
              <div className="relative w-full h-48 border rounded-lg overflow-hidden">
              <Image 
              src={imagePreview}
              alt="Imagem do produto"
              width={100}
              height={100}
              className="object-cover"
              />
              <Button className="absolute top-2 right-2 z-20" type="button" variant="destructive" onClick={clearImage}>
                 Excluir
              </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-md flex flex-col p-8 items-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2"/>
                <Label htmlFor="file">
                  Clique para selecionar uma imagem
                </Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleImageChange}
                  required
                  className="hidden"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-primary text-white hover:bg-brand-primary"
          >
            Criar produto
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
