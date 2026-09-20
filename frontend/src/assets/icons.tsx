import { ReactNode } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBookOpen, faBook, faChartLine, faHouse, faClock, faCircleUser, faArrowRightFromBracket, faArrowRight, faArrowLeft, faXmark, faTable} from '@fortawesome/free-solid-svg-icons';
import { LogoMark } from "./logo";

export const icons: Record<string, ReactNode> = {
    hamburger: (
        <FontAwesomeIcon icon={faBars} className="text-lg text-gray-700 hover:text-green-400" />
    ),
    practice : (
        <FontAwesomeIcon icon={faBookOpen} />
    ),
    test : (
        <FontAwesomeIcon icon={faBook} />
    ),
    performance: (
        <FontAwesomeIcon icon={faChartLine} />
    ),
    home : (
        <FontAwesomeIcon icon={faHouse} />
    ),
    clock: (
        <FontAwesomeIcon icon={faClock} className="text-lg"/>
    ),
    logo : (
        <LogoMark className="h-6 w-auto" />
    ),
    user : (
        <FontAwesomeIcon icon={faCircleUser} />
    ),
    logout : (
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
    ),
    arrowRight : (
        <FontAwesomeIcon icon={faArrowRight} className="text-sm"/>
    ),
    arrowLeft : (
        <FontAwesomeIcon icon={faArrowLeft} className="text-sm"/>
    ),
    exit : (
        <FontAwesomeIcon icon={faXmark}/>
    ),
    table : (
        <FontAwesomeIcon icon={faTable}></FontAwesomeIcon>
    )
};