import Link from "next/link";
import { Copy, FilePen, GraduationCap, Puzzle } from "lucide-react";

import { Card, CardContent } from "@acme/ui/card";

const StudyModes = ({ studySetId }: { studySetId: string }) => {
  const modes = [
    { Icon: Copy, text: "Flashcards", href: `${studySetId}/flashcards` },
    { Icon: GraduationCap, text: "Learn", href: `${studySetId}/learn` },
    { Icon: FilePen, text: "Test", href: `${studySetId}/test` },
    { Icon: Puzzle, text: "Match", href: `${studySetId}/match` },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {modes.map(({ href, Icon, text }, index) => (
        <Link href={href} key={index}>
          <Card className="group hover:shadow-md">
            <CardContent className="flex items-center gap-2 p-4">
              <Icon
                size={20}
                className="transition-colors duration-300 group-hover:text-primary"
              />
              <span>{text}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default StudyModes;
