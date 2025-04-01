import React from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { ArrowLeftIcon, EllipsisIcon } from "lucide-react-native";

interface StudySetHeaderProps {
  onOptionsOpen: () => void;
}

export default function StudySetHeader({ onOptionsOpen }: StudySetHeaderProps) {
  return (
    <SafeAreaView className="mx-2 flex-row justify-between">
      <Link href="/(tabs)" asChild>
        <TouchableOpacity>
          <ArrowLeftIcon size={28} />
        </TouchableOpacity>
      </Link>
      <TouchableOpacity onPress={onOptionsOpen}>
        <EllipsisIcon />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
