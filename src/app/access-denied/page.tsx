import { LogOut, ShieldX } from "lucide-react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/actions/auth"
import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AccessDenied() {
    const user = await getUser()

    if (!user) {
        redirect("/login")
    }
    return (
        <div className="bg-app-background min-h-screen flex items-center justify-center px-4 py-8">
            <Card className="bg-app-card border border-app-border w-full max-w-md mx-auto">
                <CardHeader className="items-center text-center">
                    <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-brand-primary/15">
                        <ShieldX className="size-8 text-brand-primary" />
                    </div>
                    <CardTitle className="text-white text-2xl sm:text-3xl font-bold">
                        Acesso negado
                    </CardTitle>
                    <CardDescription className="text-gray-300 text-base">
                        Você não tem permissão para acessar o painel.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                    <p className="text-sm text-gray-400">
                        Esta área é exclusiva para administradores.
                        Se você precisa de acesso, fale com o responsável da pizzaria.
                    </p>
                    <div className="space-y-3">
                        <form action={logoutAction}>
                            <Button
                                type="submit"
                                variant="ghost"
                                className="w-full gap-2 text-white hover:bg-transparent hover:text-white"
                            >
                                <LogOut className="size-4" />
                                Sair
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
