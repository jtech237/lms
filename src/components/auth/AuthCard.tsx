import { FC, ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AuthCardProps {
  title: string | ReactNode;
  description: string | ReactNode;
  form: ReactNode;
  footer: ReactNode;
  legal?: ReactNode;
}

export const AuthCard: FC<AuthCardProps> = ({
  title,
  description,
  form,
  footer,
  legal,
}) => (
  <>
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>
          <h1 className="text-2xl font-bold text-center">{title}</h1>
        </CardTitle>
        <CardDescription className="text-center">
          <p>{description}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">{form}</CardContent>
      <CardFooter className="flex flex-col">{footer}</CardFooter>
    </Card>
    {legal && <div className="mt-6 text-center text-xs">{legal}</div>}
  </>
);
