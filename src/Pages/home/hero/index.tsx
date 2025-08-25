import img from "../../../assets/image/african-children-enjoying-life.jpg"
import cardItem1 from '../../../assets/image/icon cool-icon-l1.svg'
import cardItem2 from '../../../assets/image/icon cool-icon-l4.svg'
import cardItem3 from '../../../assets/image/icon cool-icon-l7.svg'

import Card from "./Card";

const CardItem = [
  {img: cardItem1, title: "Give the Gift of Education and Hope", desc: "Your support helps us uplift orphaned children — through scholarships, mentorship, and safe homes."},
  {img: cardItem2, title: "Because Every Child Deserves a Chance", desc: "We connect children in orphanages with life-changing educational opportunities and compassionate support."},
  {img: cardItem3, title: "Give the Gift of Education and Hope", desc: "Your support helps us uplift orphaned children — through scholarships, mentorship, and safe homes"}
]
const Hero = () => {
    return (
        <div className="bg-[#F6FAFF] pt-[2rem] relative">
           <div className="flex justify-center item-center flex flex-col md:flex-row">
              <div className="mt-[0] md:mt-[4rem]">
                <p className="text-[#96BB7C] text-[12px]">Brighter Futures Begin with You,</p>
                <h2 className="text-[#252B42] text-[30px] font-bold w-[300px] sm:w-[100%]">Empowering Dreams, Transforming Lives.</h2>
                <p className="text-[#737373] text-[20px] w-[300px] sm:w-[100%]">Together, we can break the cycle of poverty by providing scholarships and holistic care for children in need.</p>
                <div>
                </div>
              </div>
              <div>
                 <img className="object-fit md:h-[400px]" src={img}/>
              </div>
           </div>
           {/* <div className="flex flex-wrap justify-center gap-6 py-10 object-fit mx-[10%] absolute top-[300px] left-[100px]">
              {CardItem.map((card, index) => (
                 <Card key={index} img={card.img} title={card.title} desc={card.desc}/>
              ))}
           </div> */}
        </div>
    )
}

export default Hero;