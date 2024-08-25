import React from "react";
import style from "../styles/publishPage.module.css"
import cancel from "../images/cancel.svg"
import imageInput from "../images/imageInput.svg"
import whiteDelete from "../images/whiteDelete.svg"
import { useState, useRef, useEffect } from "react";
import Quill from 'quill';
import '../styles/quill.css';
import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ImageCropper from "../api/cropperSettings";
import { toDataURL, dataURLtoFile } from "../api/urlToFile"
import Modal from "react-modal";
import { modalStyle } from '../api/modalSettings.js'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../api/cropperSettings.js'
import addTag from "../images/addTag.svg"
import { useDispatch, useSelector } from "react-redux"
import { getMyPlaces } from "../feature/place/placeSlice"
import { postContent, updatePost } from "../feature/post/postSlice"
import storage from "../firebase/firebase";
import {ref, getDownloadURL, uploadBytes, listAll } from "firebase/storage"
import { v4 as uuidv4 } from 'uuid';

function PlaceRefCard(props){
    return(
        <div className={style.card} style={{ display: props?.selected ? "none" : "flex" }}>
            {props.location}
        </div>
    )
}

export default function PublishPage(){
    const { user, isLoading, isError, isSuccessful, message, isGoogle } = useSelector((state) => state.auth)
    const { myPlaceList } = useSelector((state) => state.place)
    const { loading, error, successful, msg } = useSelector((state) => state.post)
    const location = useLocation();
    const postData = location && location.state && location.state.postData ? location.state.postData : null;
    const [title, setTitle] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const dispatch = useDispatch();

    const navigate = useNavigate();  

    // console.log(location.state)

    useEffect(() => {
        if(postData != null){
            setTitle(postData.title);
            setSelectedPlace(postData.post?.placeId);
            quill.current.setContents(JSON.parse(postData.text));
            if(postData.image.length > 0) setGallery(postData.image);
        }else{
            setTitle('');
            setSelectedPlace(null);
            quill.current.setContents();
            setGallery([]);
        }
        
    }, [postData])

  

    useEffect(()=>{
        setUserInfo(user);
        if(user)
            dispatch(getMyPlaces(user.followedPlaces))
    },[user, dispatch])

    //-------------------UPLOAD CONTENT-------------------//
    
    async function publishContent(){
        
        if(user && title && title.length > 0 && selectedPlace){
            
            let urlList = [];

            if(gallery.length > 0)
                urlList = await getFileUrls(gallery);

            const dataToUpload = {
                user: userInfo,
                image: urlList,
                title: title,
                html: quill.current.getText(),
                text: JSON.stringify(quill.current.getContents()),
                placeId: selectedPlace,
                at: placeAbb
            }
            
            uploadToMongodb(dataToUpload);
        }

        //DONT FORGET to clear all ObjectUrl after successfully published!
    }

    async function getFilesArray(gallery){

        //-------------------CONVERT BLOB TO DATA-------------------//

        const imageFilesArray = (gallery.map((url)=>
            toDataURL(url).then((response) =>{
                return dataURLtoFile(response, url)}
            )))
        console.log(imageFilesArray)
        return Promise.all(imageFilesArray).then(res => { return res });
    }
    // async function getFilesArray(gallery){

    //     //-------------------CONVERT BLOB URL TO DATA-------------------//
    //     let imageFilesArray = gallery.map((url) => fetch(url).then(r => r.blob).then(blob => new File([blob],"File",{type: "image/jpeg"})))
    //     return Promise.all(imageFilesArray).then(res => { return res });
    // }

    async function getFileUrls(gallery){

        //-------------------UPLOAD TO FIREBASE USING ASYNC/AWAIT-------------------//

        let getFilesArr = await getFilesArray(gallery);
        let urls = [];
        for(const file of getFilesArr){
            let id = uuidv4();
            let name = file.name.split("/").join("");
            let path = ref(storage, `post/${name + id}`);
            await uploadBytes(path, file);
            let getUrl = await getDownloadURL(path);
            urls.push(getUrl);
        }
    
        return urls;
    }

    function uploadToMongodb(data){

        //-------------------PUSH TO MONGODB-------------------//

        dispatch(postContent(data)).then((res) => {
            console.log(res)
            if(res.payload.success)
                navigate("/home");
        });
    }

    //-------------------IMAGE CROPPING-------------------//

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = useCallback(async () => {
        try {
        const croppedImage = await getCroppedImg(
            imageUrlToCrop,
            croppedAreaPixels,
        )

        uploadCroppedImage(croppedImage)
        setDisplayCropWindow(false)
        } catch (e) {
        console.error(e)
        }
    }, [croppedAreaPixels])

    //-------------------IMAGE GALLERY-------------------//

    const [gallery, setGallery] = useState([]);
    const [imageUrlToCrop, setimageUrlToCrop] = useState();
    const [displayCropWindow, setDisplayCropWindow] = useState(false);

    function onImageUpload(e){
        if(!e.target) return;
        const url = getInputImageUrl(e);
        console.log("got original image URL as: " + url)
        setimageUrlToCrop(url);//Pass Url to Cropper
        setDisplayCropWindow(true)//Open Crop Modal Window

    }

    function getInputImageUrl(e){
        const url = URL.createObjectURL(e.target.files[0])
        return url;
    }

    function uploadCroppedImage(Url){
        console.log("Cropped! Result URL is: " + Url)
        setGallery(gallery.concat([Url]))
    }

    function cancelCropping(){
        setDisplayCropWindow(false)//close Crop Modal Window
        URL.revokeObjectURL(imageUrlToCrop)//clear url cache
        console.log("canceled! corresponding URL cache cleared!")
    }

    function deleteImage(e){
        const index = gallery.indexOf(e.currentTarget.previousSibling.src);
        if(index > -1){
            let galleryCopy = [...gallery];
            galleryCopy.splice(index,1);
            setGallery(galleryCopy);
        }
    }
        //-------------------TITLE-------------------//

    function activeTitle(e){
        const style = e.currentTarget.style;
        style.backgroundColor = "transparent";
        style.borderBottom = "min(0.3vw,1.2px) solid #EAEEF4";
        style.borderRadius = "0";
        style.width = "85vw";
        style.paddingLeft = "0";

        e.currentTarget.firstElementChild.style.display = "none"
    }

        //-------------------QUILL TEXTFIELD-------------------//

        const toolBarOptions = [       
            ["bold"], ["italic"], ["underline"],[{ list: "bullet" }], [{list: "ordered"}]
        ]
        
        const quill = useRef();
    
        const quillWrapper = useCallback((wrapper)=>{
            window.scrollTo(0, 0);
            if (wrapper == null) return
    
            wrapper.innerHTML = ""
            const editor = document.createElement('div');
            wrapper.append(editor)
            quill.current = new Quill(editor, 
                {
                    theme: "snow", 
                    modules: { 
                        toolbar: {
                            container: toolBarOptions,
                        }
                        
                    }, 
                    placeholder: '详细描述可以增加点击率',
    
                }, )
        },[])
        //-------------------CHOOSE PLACE-------------------//
        const placesChoices = useRef();
        const [selectedPlace, setSelectedPlace] = useState(null);
        const [placeAbb, setPlaceAbb] = useState(null);
        const [placesChoiceExpand, setPlacesChoiceExpand] = useState(false);
        function toggleSelectPlace(place){
            if(selectedPlace === place._id){
                setSelectedPlace(null);
                setPlaceAbb(null);
            }else{
                setSelectedPlace(place._id);
                setPlaceAbb(place.shortHand);
            }
        }
        function currentSelectedPlace(){
            if(!placeAbb) return "@选择周边"
            else return "@" + placeAbb
        }
        function choosePlace(){
            placesChoiceExpand ? setPlacesChoiceExpand(false) : setPlacesChoiceExpand(true);
        }
        function hideWhenPlacesChoiceExpand(){
            return placesChoiceExpand ?  "none" : "flex";
        }
        function showWhenPlacesChoiceExpand(){
            return placesChoiceExpand ?  "flex" : "none";
        }
        //-------------------CACHE CLEARING-------------------//
        useEffect(()=>{
            return ()=>{
                console.log(gallery)
                for(let i=0; i< gallery.length; i++){
                    console.log("clearing cache at URL: " + gallery[i])
                    URL.revokeObjectURL(gallery[i]) 
                }
            }
        },[])

        //-------------------UPDATE POST-------------------//

        async function updatePosts(){
            console.log(gallery)
            if(user && title && title.length > 0 && selectedPlace){
            
                let newUrlList = [];
                let blobUrl = [], firebaseUrl = [];
                gallery.forEach(url => {
                    if(!url.includes('https://firebasestorage.googleapis.com/'))
                        blobUrl.push(url);
                    else
                        firebaseUrl.push(url)
                })
                if(blobUrl.length > 0)
                    newUrlList = await getFileUrls(blobUrl);

                const finalGallery = firebaseUrl.concat(newUrlList);
    
                const dataToUpload = {
                    user: userInfo,
                    post: {
                        postId: postData.post._id,
                        image: finalGallery,
                        title: title,
                        text: JSON.stringify(quill.current.getContents()),
                        html: quill.current.getText(),
                    }
            
                }
                
                dispatch(updatePost(dataToUpload)).then(res => {
                    if(res.payload.data.success){
                        navigate("/profile");
                    }
                });
            }
        }
    return(
        <div className={style.content}>
            {/* ---------------------> MODAL PART ---------------------> */}

            <Modal 
            isOpen={displayCropWindow} 
            appElement={document.getElementById("root")}
            ariaHideApp={true}
            defaultStyles={modalStyle}
            >
                <div className={style.CropperWindow}>
                <Cropper
                image={imageUrlToCrop}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                objectFit="horizontal-cover"
                />                    
                <div className={style.closeCropper} onClick={cancelCropping}>
                    取消
                </div>
                <div onClick={showCroppedImage} className={style.uploadButton}>
                    上传
                </div>
                </div>
            </Modal>
            {/* ---------------------> HEADER PART ---------------------> */}

            <div className={style.header}>
                <div className={style.cancelButton} onClick={() => navigate(-1)}>
                    <img className={style.cancel} src={cancel} alt=""/>
                </div>
                <div className={style.newContentText}>
                    {
                        postData ? 
                        <span>编辑内容</span>
                        :
                        <span>新内容</span>
                    }
                </div>
                {
                    postData ? 
                    <div className={style.publishButton} onClick={()=>{updatePosts()}}>
                        <span>更新</span>
                    </div>
                    :
                    <div className={style.publishButton} onClick={()=>{publishContent()}}>
                        <span>发布</span>
                    </div>
                }
            </div>

            <div className={style.inputsWrapper}>

            {/* ---------------------> IMAGE GALLERY PART ---------------------> */}

                <div className={style.imageGallery}>
                {
                    gallery.map((url) => 
                    
                    //ZAC make sure I am assigning the key correctly!!!!!!!
                    <div className={style.imageWindow} key={url}>
                        <img className={style.uploadedImage} src={url} alt=""/>
                        <div className={style.deleteButton} onClick={deleteImage}>
                            <img src={whiteDelete} className={style.deleteIcon} alt=""/>
                        </div>
                    </div>
                    )
                }
                    <div className={style.imageInputButton}>
                        <img className={style.imageInputIcon} src={imageInput} alt=""/>
                        <input 
                        className={style.imageInput}
                        type="file" 
                        accept=".png, .jpg, .jpeg" 
                        onChange={onImageUpload}
                        />
                    </div>
                </div>

                {/* ---------------------> TITLE AND TEXTFIELD PART ---------------------> */}

                <div className={style.titleInputWrapper} onClick={activeTitle}>
                    <img src={addTag} className={style.addTag} alt=""/>
                    <input id="publishTitleInput" type="text" className={style.titleInput} placeholder="标题(可选)" value={title} onChange={(e)=>setTitle(e.target.value)} />
                </div>
                <div id="quillTextField"  ref={quillWrapper}></div>

                {/* <---------------------CHOOSE PLACES PART <--------------------- */}

                <div className={style.tagsSelection}>
                    <div className={style.inputPlaceButton} onClick={choosePlace}>
                        {currentSelectedPlace()}
                    </div>
                    <div className={style.choosePlace} ref={placesChoices} style={{display: showWhenPlacesChoiceExpand()}}>
                {
                myPlaceList && myPlaceList.length > 0 
                ?
                myPlaceList.map((place, idx)=>{
                    return(
                        postData ?
                            postData.post.placeId === place._id ?
                                <div key={idx}>
                                    <PlaceRefCard 
                                        name={place.name}
                                        location={`@${place.shortHand}`}
                                        id={place._id}
                                        selected={selectedPlace === place._id}
                                    />
                                </div>
                            :
                            null
                        :
                        <div onClick={()=>{toggleSelectPlace(place); setPlacesChoiceExpand(false)}} key={idx}>
                            <PlaceRefCard 
                                key={idx}
                                name={place.name}
                                location={`@${place.shortHand}`}
                                id={place._id}
                                selected={selectedPlace === place._id}
                            />
                        </div>
                    )
                })
                :
                null
            }
            </div>

            {/* <---------------------CHOOSE TAGS PART <--------------------- */}

                    <div className={style.inputTagButton} style={{display: hideWhenPlacesChoiceExpand()}}>
                        #添加话题
                    </div>
                </div>

                
            </div>
        </div>
    )
}