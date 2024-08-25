import React, { useEffect,useState, useRef } from "react";
import { InfiniteLoader, List, WindowScroller,CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import AutoSizer from 'react-virtualized-auto-sizer';
import Loader from "../components/loader";

export default function InfiniteScroll({getNextList, preRenderRadius, rowCount}) {
    
    const [list, setList] = useState([]);
    const [isNextPageLoading, setIsNextPageLoading]  = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const innerWidth = useRef(window.innerWidth);

    const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;
    const listRowCount = (list.length < rowCount) ? list.length + 1 : list.length;
    const isRowLoaded = ({index}) => !hasNextPage || index < list.length;

    const cache = useRef(new CellMeasurerCache({fixedWidth: true}));
    
    // RECALCULATE ONLY WHEN WIDTH CHANGES
    function clearMeasureCache(){
      const widthChanged = (innerWidth.current !== window.innerWidth)
      innerWidth.current = window.innerWidth;
      if(widthChanged){
        innerWidth.current = window.innerWidth;
        cache.current.clearAll()
      }
    }

    useEffect(()=>{
      window.addEventListener("resize", clearMeasureCache, true);
      return(()=>{
        window.removeEventListener("resize", clearMeasureCache, true)
      })},[])

    const Item = ({index, key, style, parent}) => {
        return(
          <CellMeasurer
            cache={cache.current}
            columnIndex={0}
            key={key}
            parent={parent}
            rowIndex={index}
          >
          <div key={key} style={style}>
          {!isRowLoaded({index}) ? <div className = "loaderWrapper"><Loader/></div> : list[index]}
          </div>
          </CellMeasurer>
        )
    }

    function loadNextPage(){
      // console.log("start loading page, current list is", list)
      setIsNextPageLoading(true)
      getNextList(list.length).then((newRows) =>{
        // console.log("newRows is: ", newRows)
        setList([...list].concat(newRows))
        cache.current.clear(list.length,0)
        setIsNextPageLoading(false);
      }).catch(()=>{
        setHasNextPage(false);
      })
    }

 return (
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={rowCount}
          threshold={preRenderRadius}
        >
          {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, scrollTop, isScrolling}) => (
              <AutoSizer disableHeight>
                {({width}) => (
                <List
                  autoHeight
                  height={height}
                  width={width}
                  rowCount={listRowCount}
                  rowRenderer={Item}
                  overscanRowCount={5}
                  rowHeight={cache.current.rowHeight}
                  onRowsRendered={onRowsRendered}
                  isScrolling={isScrolling}
                  scrollTop={scrollTop}
                  ref={registerChild}
                  deferredMeasurementCache={cache.current}
                />
                )}
                </AutoSizer>
                )}
          </WindowScroller>
          )}
        </InfiniteLoader>
      );
  }