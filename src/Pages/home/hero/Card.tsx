interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    img?: string;
    title?: string;
    desc?: string;
}

const Card = ({img, title, desc}: CardProps) => {
    return (
        <div className="w-[300px] max-w-sm bg-white rounded-xl shadow-md p-6 text-center hover:-translate-y-1 transition-transform duration-300">
            <img className="mb-[10px] mx-auto" src={img} alt="" />
            <div className="mb-[10px]">
                <p className="text-center text-[18px]">{title}</p>
                <div className="border-2 border-[#E74040] my-[10px] w-[50px] mx-auto text-center"></div>
            </div>
            <p>
               {desc}
            </p>
        </div>
    );
}

export default Card;