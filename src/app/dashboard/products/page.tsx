import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { apiClient } from "@/lib/api"
import { getToken } from "@/lib/auth"
import { Category, Product } from "@/lib/types"
import { ProductForm } from "@/components/dashboard/product-form"
import { DeleteButton } from "@/components/dashboard/delete-button"

 
function formatPrice(priceInCents: number) {
  return (priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export default async function Products() {
  const token = await getToken()

  const [products, categories] = await Promise.all([
    apiClient<Product[]>("/products", {
      token: token!,
    }),
    apiClient<Category[]>("/category", {
      token: token!,
    }),
  ])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Produtos
          </h1>
          <p className="text-sm sm:text-base mt-1">Gerencie o cardápio</p>
        </div>

        <ProductForm categories={categories} />
      </div>

      {products.length !== 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-app-card border-app-border transition-shadow hover:shadow-md text-white overflow-hidden pt-0"
            >
              <img
                src={product.banner}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <CardHeader>
                <CardTitle className="text-base md:text-lg flex items-center gap-2 justify-between ">
                  <div className="flex flex-row gap-2 items-center">
                  <span>{product.name}</span>
                  </div>

                  <DeleteButton productId={product.id} />
                  
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-brand-primary">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {product.category.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
