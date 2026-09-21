import { apiClient } from "@/lib/api";
import { useEffect, useState } from "react";
import { Order } from "../../lib/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { finishOrder } from "@/actions/orders";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";


interface OrderModalProps {
    orderId: string | null;
    onClose: () => Promise<void>;
    token: string;
}

export function OrderModal({ orderId, onClose, token }: OrderModalProps) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    useEffect(() => {
        if (!orderId) {
            setOrder(null);
            return;
        }

        let active = true;

        async function loadOrder() {
            try {
                setLoading(true);
                setOrder(null);

                const response = await apiClient<Order>(
                    `/order/detail?order_id=${orderId}`,
                    {
                        method: "GET",
                        token,
                    }
                );

                if (active) {
                    setOrder(response);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadOrder();

        return () => {
            active = false;
        };
    }, [orderId, token]);

    const calculateSubtotal = (price: number, amount: number) => {
        return price * amount;
    };

    const orderTotal =
        order?.items?.reduce((total, item) => {
            return total + calculateSubtotal(item.product.price, item.amount);
        }, 0) ?? 0;

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            void onClose();
        }
    };

    const handleFinishOrder = async () => {
        if(!orderId) return
        
        const result = await finishOrder(orderId)

       if(result.success){
        router.refresh()
        onClose()
       }
    }

    return (
        <Dialog open={orderId !== null} onOpenChange={handleOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="border-app-border bg-app-card p-6 text-white sm:max-w-lg"
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Detalhes do pedido
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Informações da mesa, cliente e itens do pedido
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <p className="py-8 text-center text-gray-400">
                        Carregando detalhes do pedido...
                    </p>
                ) : order ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-gray-400">Mesa</p>
                                <p className="font-semibold">Mesa {order.table}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">Cliente</p>
                                <p className="font-semibold">
                                    {order.name || "Não informado"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">Status</p>
                                <span className="mt-1 inline-flex rounded-full bg-gray-700 px-2 py-1 text-xs">
                                    Em produção
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-3 text-sm font-semibold">
                                Itens do pedido
                            </h3>

                            {order.items && order.items.length > 0 ? (
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-end justify-between gap-4"
                                        >
                                            <div>
                                                <p className="font-semibold">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Quantidade: {item.amount}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {formatPrice(item.product.price)}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Subtotal:{" "}
                                                    {formatPrice(
                                                        calculateSubtotal(
                                                            item.product.price,
                                                            item.amount
                                                        )
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">
                                    Nenhum item encontrado.
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between border-t border-app-border pt-4">
                            <p className="font-semibold">Total</p>
                            <p className="text-lg font-bold">
                                {formatPrice(orderTotal)}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="py-8 text-center text-gray-400">
                        Não foi possível carregar o pedido.
                    </p>
                )}

                <DialogFooter className="-mx-6 -mb-6 border-app-border bg-transparent px-6">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-app-border bg-transparent text-white hover:bg-transparent hover:text-white"
                        >
                            Fechar
                        </Button>
                    </DialogClose>

                    <Button
                        type="button"
                        disabled={!order || loading}
                        className="bg-brand-primary text-white hover:bg-brand-primary/80"
                        onClick={handleFinishOrder}
                    >
                        Finalizar pedido
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}