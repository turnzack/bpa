"use client";

import { CircleAlert, RotateCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** En-tête de section : titre + description courte. */
export function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

/** État d'erreur standard : alerte destructive + bouton Réessayer. */
export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Alert variant="destructive" role="alert">
      <CircleAlert className="size-4" aria-hidden="true" />
      <AlertTitle>Erreur de chargement</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{message}</span>
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RotateCw className="size-4" aria-hidden="true" /> Réessayer
        </Button>
      </AlertDescription>
    </Alert>
  );
}

/** Squelette de liste réutilisable pendant le premier chargement. */
export function ListSkeleton({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

/** Squelette de grille de cartes (analytics, roadmap…). */
export function GridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div
      className={cn("grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6", className)}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  );
}
