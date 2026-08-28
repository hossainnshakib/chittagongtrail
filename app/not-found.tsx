import { Container, Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Container className="text-center">
        <h1 className="font-display text-6xl md:text-7xl font-bold text-text mb-6">
          404
        </h1>
        <p className="text-xl text-text-secondary mb-8 max-w-md mx-auto">
          This trail doesn&apos;t seem to exist. Maybe it&apos;s been lost to time,
          or perhaps it was never there at all.
        </p>
        <Button href="/" variant="primary">
          Back to Chittagong Trail
        </Button>
      </Container>
    </div>
  );
}
