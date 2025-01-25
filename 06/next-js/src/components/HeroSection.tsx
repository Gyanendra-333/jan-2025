import Link from "next/link";
import { Spotlight } from "./ui/Spotlight";
import { Button } from "./ui/moving-border";


function HeroSection() {
    return (
        <div className="h-auto md:h-[40rem] w-full rounded-md flex flex-col items-center justify-center relative overflow-hidden mx-auto py-10 md:py-0 ">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="aliceblue" />
            <div className="relative w-full z-10 text-center ">
                <h1 className="mt-16 md:mt-0 text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 ">Learn like you would
                    at India's Top tech
                    companies</h1>
                <p className="mt-4 font-normal text-base md:text-lg text-neutral-300 max-w-lg mx-auto">Work-experience based learning programs to land your dream tech job Build professional projects like the top 1% tech professionals.Master the latest Fullstack/Backend/Automation tech with real work-ex.Crack your dream role at the best tech companies</p>
                <div className="mt-4">
                    <Link href={"/courses"}><Button>More Courses...</Button></Link>
                </div>
            </div>
        </div>
    )
}

export default HeroSection;