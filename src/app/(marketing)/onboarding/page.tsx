"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingHeader from "@/components/onboarding/header";
import Quiz from "@/components/onboarding/quiz";
import { externalApi } from "@/lib/api/client";
import {
  ActivitiesEnjoyed,
  AgeGroup,
  GroupSportType,
  getActivitiesEnjoyedLabel,
  getAgeGroupLabel,
  getGroupSportTypeLabel,
} from "@/types/enums";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [sportType, setSportType] = useState<string>("");
  const [ballSportPreference, setBallSportPreference] = useState<string>("");
  const [activities, setActivities] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState<string>("");
  const [disableNext, setDisableNext] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);

  // Submit the quiz data when the final step is shown
  useEffect(() => {
    if (currentStep === 4 && !apiResponse && !isSubmitting) {
      completeQuiz();
    }
  }, [currentStep, apiResponse, isSubmitting]);

  // Convert enum values to array of string options
  const sportTypeOptions = Object.values(GroupSportType)
    .filter((value) => typeof value === "number")
    .map((value) => getGroupSportTypeLabel(value as GroupSportType));

  const activityOptions = Object.values(ActivitiesEnjoyed)
    .filter((value) => typeof value === "number")
    // Always filter out the BALL activity from the activities list
    // since we ask about it in a separate question
    .filter((value) => value !== ActivitiesEnjoyed.BALL)
    .map((value) => getActivitiesEnjoyedLabel(value as ActivitiesEnjoyed));

  const ageGroupOptions = Object.values(AgeGroup)
    .filter((value) => typeof value === "number")
    .map((value) => getAgeGroupLabel(value as AgeGroup));

  const ballSportOptions = [
    "Da, preferiram ih",
    "Nisu baš moj đir",
    "Svejedno mi je",
  ];

  // Add ball activity to the selectedActivities if the user likes ball sports
  const getSelectedActivitiesWithBall = () => {
    const allActivities = [...activities];

    // Only add ball to the final results, not to the UI selection
    if (
      ballSportPreference === "Da, preferiram ih" ||
      ballSportPreference === "Svejedno mi je"
    ) {
      const ballActivity = getActivitiesEnjoyedLabel(
        ActivitiesEnjoyed.BALL,
      ).toLowerCase();
      if (!allActivities.includes(ballActivity)) {
        allActivities.push(ballActivity);
      }
    }

    return allActivities;
  };

  // Function to get enum key from label
  const getGroupSportTypeKey = (label: string): string => {
    const entries = Object.entries(GroupSportType).filter(
      ([key, value]) => typeof value === "number",
    );
    for (const [key, value] of entries) {
      if (getGroupSportTypeLabel(value as GroupSportType) === label) {
        return key;
      }
    }
    return "DEFAULT";
  };

  const getAgeGroupKey = (label: string): string => {
    const entries = Object.entries(AgeGroup).filter(
      ([key, value]) => typeof value === "number",
    );
    for (const [key, value] of entries) {
      if (getAgeGroupLabel(value as AgeGroup) === label) {
        return key;
      }
    }
    return "ADULTS";
  };

  const getActivityKeys = (labels: string[]): string[] => {
    const result: string[] = [];
    const entries = Object.entries(ActivitiesEnjoyed).filter(
      ([key, value]) => typeof value === "number",
    );

    for (const label of labels) {
      for (const [key, value] of entries) {
        if (
          getActivitiesEnjoyedLabel(
            value as ActivitiesEnjoyed,
          ).toLowerCase() === label.toLowerCase()
        ) {
          result.push(key);
          break;
        }
      }
    }

    return result;
  };

  const completeQuiz = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Get user ID from local storage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in local storage");
        return;
      }

      // Get all selected activities including ball sports
      const selectedActivitiesWithBall = getSelectedActivitiesWithBall();

      // Prepare the data for API
      const quizData = {
        user_name: userId,
        age: getAgeGroupKey(ageGroup),
        group_style: getGroupSportTypeKey(sportType),
        activities: getActivityKeys(selectedActivitiesWithBall),
        city: "",
        district: "",
        sport_interests: [],
      };

      // Send the data to the external API
      const response = await externalApi.post(
        `/users/update/${userId}`,
        quizData,
      );

      console.log("Quiz data submitted successfully:", response);
      setApiResponse(response);

      // Store the response in sessionStorage so the suggestion page can access it
      sessionStorage.setItem("quizApiResponse", JSON.stringify(response));

      // Redirect to suggestion page
      router.push("/suggestion");
    } catch (error) {
      console.error("Failed to submit quiz data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectSportType = (value: string) => {
    setSportType(value);
    setDisableNext(false);
  };

  const handleSelectBallSportPreference = (value: string) => {
    setBallSportPreference(value);
    setDisableNext(false);
  };

  const handleSelectActivities = (values: string[]) => {
    setActivities(values);
    // Enable next button only if at least one activity is selected
    setDisableNext(values.length === 0);
  };

  const handleSelectAgeGroup = (value: string) => {
    setAgeGroup(value);
    setDisableNext(false);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);

      // Set disableNext based on the current step's selection status
      if (currentStep === 0) {
        setDisableNext(sportType === "");
      } else if (currentStep === 1) {
        setDisableNext(ballSportPreference === "");
      } else if (currentStep === 2) {
        setDisableNext(activities.length === 0);
      } else if (currentStep === 3) {
        setDisableNext(ageGroup === "");
      } else {
        setDisableNext(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);

      // Set disableNext based on the previous step's selection status
      if (currentStep === 1) {
        setDisableNext(sportType === "");
      } else if (currentStep === 2) {
        setDisableNext(ballSportPreference === "");
      } else if (currentStep === 3) {
        setDisableNext(activities.length === 0);
      } else if (currentStep === 4) {
        setDisableNext(ageGroup === "");
      } else {
        setDisableNext(false);
      }
    }
  };

  // Render the appropriate quiz step based on currentStep
  const renderQuizStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Quiz
            question="Volite li više igrati samostalno ili u timu?"
            options={sportTypeOptions}
            onSelect={handleSelectSportType}
            allowMultiple={false}
          />
        );
      case 1:
        return (
          <Quiz
            question="Voliš li sportove sa loptom?"
            questionDescription="Odaberi opciju koja najbolje opisuje tvoje preferencije."
            options={ballSportOptions}
            onSelect={handleSelectBallSportPreference}
            allowMultiple={false}
          />
        );
      case 2:
        return (
          <Quiz
            question="Koje aktivnosti najviše uživate raditi?"
            questionDescription="Izaberi sve aktivnosti koje se odnose na tebe."
            options={activityOptions}
            onMultiSelect={handleSelectActivities}
            allowMultiple={true}
            selectedValues={activities}
            useGrid={true}
          />
        );
      case 3:
        return (
          <Quiz
            question="Odaberi svoju dobnu skupinu."
            options={ageGroupOptions}
            onSelect={handleSelectAgeGroup}
            allowMultiple={false}
          />
        );
      case 4:
        // Get all selected activities including ball sports
        const selectedActivitiesWithBall = getSelectedActivitiesWithBall();

        return (
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-4xl font-bold text-white">
                Hvala na odgovorima!
              </h2>
              <p className="text-base font-medium text-white/80">
                {isSubmitting
                  ? "Obrađujemo vaše odgovore..."
                  : apiResponse
                    ? "Vaši odgovori su uspješno zabilježeni. Preusmjeravamo vas na prijedloge..."
                    : "Vaši odgovori su zabilježeni."}
              </p>
              <div className="mt-6 rounded-lg bg-[#45275A]/60 p-6 text-left">
                <h3 className="mb-4 text-xl font-bold text-white">
                  Vaši odabiri:
                </h3>
                <p className="text-white/90">
                  <strong>Tip sporta:</strong> {sportType}
                </p>
                <p className="text-white/90">
                  <strong>Sportovi s loptom:</strong> {ballSportPreference}
                </p>
                <p className="text-white/90">
                  <strong>Odabrane aktivnosti:</strong>{" "}
                  {selectedActivitiesWithBall.length > 0
                    ? selectedActivitiesWithBall.join(", ")
                    : "Niste odabrali aktivnosti"}
                </p>
                <p className="text-white/90">
                  <strong>Dobna skupina:</strong> {ageGroup}
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between bg-[url('/onboarding_bg.svg')] bg-cover bg-center pb-11">
      <OnboardingHeader currentStep={currentStep} totalSteps={4} />

      {renderQuizStep()}

      <div className="flex gap-4">
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-white px-4 py-2 text-sm text-white transition-all duration-300 hover:bg-white/20"
          >
            Natrag
          </button>
        )}
        {currentStep < 4 && (
          <button
            onClick={handleNext}
            disabled={disableNext}
            className={`bg-cta flex w-fit cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm text-white transition-all duration-300 ${
              disableNext ? "cursor-not-allowed opacity-50" : "hover:bg-cta/80"
            }`}
          >
            Sljedeća
          </button>
        )}
      </div>
    </div>
  );
}
