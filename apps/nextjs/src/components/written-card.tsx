import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import { Check } from "lucide-react";

import { cn } from "@acme/ui";
import { Alert, AlertDescription, AlertTitle } from "@acme/ui/alert";
import { Card, CardContent } from "@acme/ui/card";
import { FormItem } from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";

interface WrittenCardProps extends InputHTMLAttributes<HTMLInputElement> {
  term: string;
  userAnswer?: string;
  definition?: string;
}

const WrittenCard = forwardRef<HTMLInputElement, WrittenCardProps>(
  ({ term, userAnswer, definition, ...props }, ref) => {
    return (
      <Card>
        <CardContent className="flex min-h-[30rem] flex-col p-6">
          <div className="flex flex-1 flex-col sm:mb-12 sm:flex-row">
            <div className={`flex-1 pb-4`}>
              <span className="mb-6 block font-bold text-muted-foreground">
                Term
              </span>
              <span className="text-2xl">{term}</span>
            </div>
          </div>
          <div>
            <FormItem>
              <Label>Your answer</Label>
              <Input
                ref={ref}
                type="text"
                {...props}
                readOnly={!!userAnswer}
                value={userAnswer}
                className={cn({
                  "border-green-600 bg-green-600/10":
                    userAnswer && userAnswer === definition,
                  "border-red-600 bg-red-600/10":
                    userAnswer && userAnswer !== definition,
                })}
              />
            </FormItem>
            {userAnswer !== definition && (
              <Alert className="mt-4 border-green-600 text-green-600">
                <Check size={16} className="text-green-600" />
                <AlertTitle>{definition}</AlertTitle>
                <AlertDescription>Correct answer</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

WrittenCard.displayName = "WrittenCard";

export default WrittenCard;
