import { Calendar, MessageCircle } from "lucide-react";
import Image from "next/image";

const BlogCard = () => {
  return (
    <div className="flex flex-col w-full ">
      <div className="flex w-full flex-col gap-3 items-start justify-start text-start">
        <div className="w-full md:w-[375px] h-auto rounded-t-xl">
          <Image
            src="/assets/images/home/why/history.png"
            alt="Blog Image"
            width={375}
            height={275}
            className="rounded-t-xl object-cover w-full"
          />
        </div>
        <div className="flex flex-col gap-3 px-3">
          <b className="font-bold text-xl">
            Everything you need to know about Singingbowl
          </b>
          <p>
            Sorem ipsum dolor sesdit amet consectetur adipisicing elitseeiusmod
            tempor.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Calendar className="text-green-500 w-4 h-4" /> July 29, 2020
            </span>

            <span className="flex items-center gap-2">
              <MessageCircle className="text-green-500 w-4 h-4" /> July 29, 2020
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BlogCard