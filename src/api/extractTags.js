export default function extractTags(string){
    if(!string) return //as empty string
    const resultArray = string.split("@@@")

    //input title string has no tags
    if(resultArray.length === 1){
        return(
            {
                tagsArray: [],
                title: string
            }
        )
    }

    else return(
        {
            tagsArray: resultArray.slice(0,resultArray.length - 1),
            title: resultArray[resultArray.length - 1]
        }
    )
}