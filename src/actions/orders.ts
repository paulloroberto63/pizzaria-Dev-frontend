"use server"

import { apiClient } from "@/lib/api"
import { getToken } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function finishOrder(orderId: string) {
    
    if(!orderId) {
        return { success: false, message: "Pedido não encontrado" }
    }

    const token = await getToken()

    if(!token) {
        return { success: false, message: "Token não encontrado" }
    }
    
    const data = {
        order_id: orderId,
    }

  try {
    await apiClient(`/order/finish`, {
      method: "PUT",
      body: JSON.stringify(data),
      token: token
    })
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao finalizar o pedido"
    }
  }

  revalidatePath("/dashboard")

  return { success: true }

}