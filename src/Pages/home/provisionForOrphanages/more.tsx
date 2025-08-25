import { IoIosArrowForward } from "react-icons/io";
import img from "../../../assets/image/medium-shot-kids-sitting-outdoors.jpg"
const More = () => {
    return (
        <div className="flex flex-col md:flex-row md:px-[10%]">
        <div className="md:w-[50%]">
            <div className="border-2 border-[#E74040] my-[1rem] w-[100px]"></div>
            <p className="text-[20px] my-[1rem]">We provide for the needy</p>
            <p>We partner with orphanages to supply food, clothing, learning materials, healthcare items, and infrastructure support — ensuring that children not only survive but thrive in safe, nurturing environments. Apply now if you are a orphanage director.</p>
            <button className="flex items-center text-[#96BB7C] mt-[1rem] justify-center">Apply Now<IoIosArrowForward className="ml-[12px] mt-[2px]" /></button>
        </div>
        <div className="md:pl-[30px] md:w-[50%] object-fit">
            <img src={img}/>
        </div>
        </div>
    );
}

export default More;