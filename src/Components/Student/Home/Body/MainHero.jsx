import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid';
import Button from '../../../OtherComponents/Button';
import { useNavigate } from 'react-router-dom';

export default function MainHero() {
  const navigator=useNavigate();  
  const btnHandler=()=>{
    navigator('/mentor/signup')
  }
  return (
    <div className="relative isolate overflow-hidden bg-yellow-400 px-6 py-32 sm:py-40  lg:px-0">
      {/* Background SVG Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          aria-hidden="true"
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" width="100%" height="100%" strokeWidth={0} />
        </svg>
      </div>

      {/* Content and Image Section */}
      <div className="relative mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Left Text Section */}
        <div className="flex flex-col justify-center space-y-6 lg:pr-4 lg:max-w-lg">
          <h1 className="text-4xl font-bold text-black">
            Learn something new everyday.
          </h1>
          <p className="text-lg text-gray-700">
            Become professionals and ready to join the world.
          </p>
          <div className="flex space-x-4">
            <button
            onClick={()=>navigator('/search')}
             className="bg-white text-black py-2 px-4 rounded-lg shadow-md hover:bg-gray-100">
              Browse
            </button>
            <Button onClick={btnHandler} text={"Become Instructor"}/>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="relative lg:absolute lg:-top-20 lg:right-[-15rem] lg:w-[48rem] overflow-hidden">
          <img
            src="https://tailwindui.com/plus/img/component-images/dark-project-app-screenshot.png"
            alt="Code Editor Screenshot"
            className="w-full max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10"
          />
        </div>
      </div>
    </div>
  );
}
