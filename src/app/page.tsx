import ProgressRail from "@/components/ProgressRail";
import ReducedMotionToggle from "@/components/ReducedMotionToggle";
import StoryExperience from "@/components/StoryExperience";

export default function Home() {
    return (
        <div className="flex flex-col w-full relative">
            <ReducedMotionToggle />
            <ProgressRail />
            <StoryExperience />
        </div>
    );
}
