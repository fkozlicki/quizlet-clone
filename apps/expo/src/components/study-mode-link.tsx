import type { Href } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";
import { Link } from "expo-router";

interface StudyModeLinkProps {
  Icon: LucideIcon;
  title: string;
  href: Href;
}

const StudyModeLink = ({ Icon, title, href }: StudyModeLinkProps) => {
  return (
    <Link href={href} asChild>
      <View className="flex-1 flex-row items-center gap-4 rounded-lg bg-white p-4">
        <Icon className="size-12" />
        <Text className="mb-1 text-lg font-semibold text-muted-foreground">
          {title}
        </Text>
      </View>
    </Link>
  );
};

export default StudyModeLink;
