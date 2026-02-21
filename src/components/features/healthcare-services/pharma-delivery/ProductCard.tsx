
"use client";

import type { PharmacyProduct } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pill, ShoppingCart, TriangleAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: PharmacyProduct;
}

// Helper function to get the local image path based on product ID
const getProductImagePath = (productId: string): string | undefined => {
  switch (productId) {
    case 'med001': return '/aspirin.webp'; // Aspirin
    case 'med002': return '/omega.jpg';    // Omega-3
    case 'med003': return '/para.jpg';     // Paracetamol
    case 'med004': return '/vitamin.webp'; // Vitamin D3
    case 'med005': return '/atorvastatin.jpg';// Atorvastatin
    case 'med006': return '/clopid.png';   // Clopidogrel
    case 'med007': return '/amlodipine.jpg';// Amlodipine
    case 'med008': return '/metformin.webp';// Metformin
    default: return undefined;
  }
};

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: `${product.productName} added to cart`,
      description: "View your cart to proceed to checkout.",
    });
  };

  const imagePath = getProductImagePath(product.id) || product.imageUrl;
  const imageAltText = `Image of ${product.productName}`;

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full group">
      <CardHeader className="p-0">
        <div className="relative w-full h-40 bg-muted group-hover:opacity-90 transition-opacity">
          <Image
            src={imagePath}
            alt={imageAltText}
            fill
            style={{ objectFit: 'contain' }} // Use 'contain' to see the whole product
            className="p-2"
            data-ai-hint={product.imageHint || product.category.toLowerCase()}
            onError={(e) => {
              // Fallback if local image is specified but not found, or if product.imageUrl also fails
              (e.target as HTMLImageElement).src = `https://placehold.co/300x200.png?text=${encodeURIComponent(product.productName.split(' ')[0])}+Not+Found`;
              (e.target as HTMLImageElement).alt = `${product.productName} image not found`;
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-2">
        <CardTitle className="text-md font-semibold group-hover:text-primary transition-colors line-clamp-2 h-12">
          {product.productName}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-3 h-12">
          {product.description}
        </CardDescription>
        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-bold text-primary">₹{product.price.toFixed(2)}</p>
          {product.inStock ? (
            <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">In Stock</Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
          )}
        </div>
         {product.prescriptionRequired && (
            <Badge variant="outline" className="text-xs text-amber-600 border-amber-500 w-full justify-center py-1 mt-1">
                <TriangleAlert className="mr-1 h-3 w-3" /> Prescription Required
            </Badge>
        )}
        {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
                {product.tags.slice(0,3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
            </div>
        )}
      </CardContent>
      <CardFooter className="p-4">
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
