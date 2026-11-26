import { Container, Button } from "@/components/ui";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function NotFound() {
  return (
    <PublicLayout>
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Container className="text-center">
        <h1 className="font-display text-6xl md:text-7xl font-bold text-text mb-6">
          404
        </h1>
        <p className="text-xl text-text-secondary mb-8 max-w-md mx-auto">
          This page doesn’t seem to exist.
        </p>
        <Button href="/" variant="primary">
          Back to Chittagong Trail
        </Button>
      </Container>
    </div>
    </PublicLayout>
  );
}
