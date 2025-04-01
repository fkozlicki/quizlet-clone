import { useRef } from "react";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import {
  CopyIcon,
  FilePenIcon,
  GraduationCapIcon,
  PuzzleIcon,
} from "lucide-react-native";

import CardCarousel from "~/components/card-carousel";
import StudyModeLink from "~/components/study-mode-link";
import StudySetHeader from "~/components/study-set-header";
import { api } from "~/utils/api";

const StudySet = () => {
  const { id }: { id: string } = useLocalSearchParams();
  const { data } = api.studySet.byId.useQuery({ id });

  const snapPoints = ["60%"];

  const bottomSheetRef = useRef<BottomSheet>(null);

  const onOptionsOpen = () => bottomSheetRef.current?.expand();

  return (
    <SafeAreaView>
      <StudySetHeader onOptionsOpen={onOptionsOpen} />
      <ScrollView className="relative py-4">
        <CardCarousel cards={data?.flashcards ?? []} />

        <View className="mx-4 mb-4">
          <Text className="mb-4 text-3xl font-extrabold text-gray-700">
            {data?.title}
          </Text>

          <View className="flex-row items-center">
            <View className="flex-row items-center gap-2">
              <Image
                source={{
                  uri: "https://reactnative.dev/img/tiny_logo.png",
                }}
                className="size-8 rounded-full"
              />
              <Text className="font-semibold text-gray-700">
                {data?.user.name}
              </Text>
            </View>
            <View className="mx-3 h-3/4 w-px bg-gray-300"></View>
            <Text className="font-semibold text-gray-500">
              {data?.flashcards.length} terms
            </Text>
          </View>
        </View>

        <View className="mx-4 mb-4 gap-2">
          <View className="flex-row gap-2">
            <StudyModeLink
              Icon={CopyIcon}
              title="Flashcards"
              href={`/study-set/${id}/flashcards`}
            />
            <StudyModeLink
              Icon={GraduationCapIcon}
              title="Learn"
              href={`/study-set/${id}/learn`}
            />
          </View>
          <View className="flex-row gap-2">
            <StudyModeLink
              Icon={FilePenIcon}
              title="Test"
              href={`/study-set/${id}/test`}
            />
            <StudyModeLink
              Icon={PuzzleIcon}
              title="Match"
              href={`/study-set/${id}/match`}
            />
          </View>
        </View>

        <View className="mx-4">
          <Text className="mb-2 text-lg font-bold">Terms</Text>
          <FlashList
            className="flex-1"
            scrollEnabled={false}
            data={data?.flashcards}
            renderItem={({ item }) => (
              <View className="rounded-lg bg-white p-4">
                <Text className="mb-2 text-lg">{item.term}</Text>
                <Text className="text-lg">{item.definition}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View className="h-4" />}
          />
        </View>

        <View className="h-12"></View>
      </ScrollView>
      <BottomSheet
        style={{
          zIndex: 100,
        }}
        index={-1}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={BottomSheetBackdrop}
      >
        <BottomSheetView className="flex-1">
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default StudySet;
