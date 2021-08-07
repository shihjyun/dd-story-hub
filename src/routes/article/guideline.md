---


# yml 格式撰寫注意事項：
# 1. 在「---」區間的都屬於文章基本資料的設定
# 2. 在文章基本資料設定中，各個屬性（像是 title, author ... 等等）之後接文字的第一個空白請使用半形空白！
# 3. 通常如果有次項目（像是 read_more 的「-」），在 HackMD 寫的時候會自動縮排，請不要把這個縮排消除！

title: DD Story Hub 文章搬運指南 🚚 # 必填，填寫文章標題
author: DD Story Hub # 必填，填寫作者名稱（顯示在頁面上）
author_id: ddstoryhub # 必填，請填寫當初寫在 google docs 上的 author_id
description: 教大家如何在初期搬運 Medium 上的文章，並以此篇文件示範如何使用各種元件！ # 必填，這篇文章的引言，會顯示在標題下方
published_date: 2020-08-08 # 必填，文章發布日期
updated_date: 2021-04-06 # 必填，文章修改日期，如果是第一次發文就寫發布日期
tags: # 必填，顯示在文章末端的 tag，主要用途是給讀者辨識這篇文章的屬性，填寫格式：tag1,tag2,tag3 ...
meta_tags: # 必填，給搜尋引擎看的，這個 tags 可以填發散、隨性一點，填寫格式：tag1,tag2,tag3 ...
category: DD文件 # 必填，你的文章是哪個種類（資訊圖表/資料分析/數位敘事/經驗分享）
cover_image: https://ddstoryhub.com/assets/article/guideline/cover.png # 必填，文章封面圖片，也會成為 facebook 的分享圖片，比例請使用 1200 * 630
cover_image_description: 很多工人啊！ # 選填，封面圖片說明
read_more: # 必填，推薦其他站上的文章，請填寫文章網址 article 之後的編號，請至少填寫1篇，至多6篇 
  - 2021-0606
  - 2021-0406
  - 2021-0620 
slug: guideline # 文章辨識碼，請填寫 YYYY-MMDD Ex: 2021-0808
cover_full: false # 文章首圖是否要用滿螢幕模式
---

<script>
  // 這塊使用 <script> 包起來的部分基本上不用動，也千萬不要動！這是引入客製化元件的地方 ～
  import Img from '$lib/article/Img.svelte'
  import Bookmark from '$lib/article/Bookmark.svelte'
  import LittleGreyBox from '$lib/article/LittleGreyBox.svelte'
  import TableOfContents from '$lib/article/TableOfContents.svelte'
</script>


<TableOfContents>

- 文章的基本檔案結構
- Markdown 撰寫注意事項
- 元件介紹
- 如何從 Medium 搬運文章？

</TableOfContents>

嗨嗨 DD Story Hub 的各位～雖然網站上線時間一再延拓 XD，但在規劃會議的一個月之後，我們終於來到了網站準備正式上線的階段了🎉！

這篇文章原本是想教大家如何在我們的網站上發布文章，但這樣資訊量可能一次會太多，所以我們就先從「如何上稿」開始吧！

> 這篇文章的 markdown 檔案也同步發布在[HackMD](https://hackmd.io/kFBnpclUT0-fjJJDHSJ69Q)上！各位可以參考對照一些語法/元件上的使用方式～

---

## 文章的基本檔案結構

如果在 DD Story Hub 要發表一篇文章，我們只需要準備：

- 一份以 **文章slug** 為檔名的 `.md` 檔案
- 一個以 **文章slug** 為名稱的資料夾，用來放這篇文章會用到的一些檔案（圖片 ... 等）

以現在這篇來說，目錄結構會長成像這樣：

```
/
│ guideline.md
│  
├──── guideline
│         cover.png
│         2.png
│         3-left.png
│         3-right.png
│          ...
│          ...
│        

```

看起來很簡單ㄅ！

---

## Markdown 撰寫注意事項

這邊我覺得大家需要注意的地方只會有一個，就是做任何事情 **「多多換行絕對不事件壞事，但不換行就有可能會出事」** ！

舉例來說，如果這個段落只有按一次 Enter
文章中其實是不會分段的！（請對照 Markdown 檔案來看，就會明白了！）


但像是這個段落，不管我在 Markdown 檔案中換多少行




它只會把這段當成獨立的一段！不會因為換比較多行，段與段之間的空白就變多，所以不要怕，當你想要分段的時候請盡量按 Enter 吧。

而這種需要換行的概念不只用在段落而已，使用接下來介紹的各種元件時，也請多多注意這件事～

---

## 各式各樣的元件介紹

目前我和T編根據各位在 Medium 上的使用習慣，製作了兩種主要類型的元件：

- **基本款元件**：像是一般的文章段落、連結 ... 等，我們都有做一些基本的風格化處理，大家只需要正常寫 Markdown 語法就好了
- **特製款元件**：功能多變，但使用時需要引入特殊語法

---

## 基本款元件 👀

以下元件的使用示範請對照這篇的 [Markdown檔案](https://hackmd.io/kFBnpclUT0-fjJJDHSJ69Q)～

## H2 標題

### H3 標題

一般的文字段落

> 引言
>
> 如果要在引言中分段，也請記得換行嘿
> 
> 引言中[加入連結](https://ddstoryhub.com)也是沒問題的！

使用**粗體字**

打一點 `code` 在段落中

- 列表1
- 列表2
- 列表3

分隔線⬇️

---


## 特製款元件 ✨

特製款元件，需要寫一些些類似像 `html` 的 code，但請別擔心，這些使用上都還算簡單(?)

目前我們有以下這幾種特製款元件：

- `Img` ：圖片嵌入元件，可以依據編輯需求，使用4種不一樣的圖片嵌入模式
- `Bookmark` ：書籤元件，用來放一些參考資料的連結，它的好處是可以顯示連結的一部分預覽圖以及文字
- `LittleGreyBox` ： 小灰盒元件，嗯，就是另一種文字方塊
- `TableOfContents` ：文章目錄元件，通常會像這篇一樣擺在文章開頭處，但不一定強制要放

現在就馬上來介紹各種元件的使用方式！以下元件的使用示範也請對照這篇的 [Markdown檔案](https://hackmd.io/kFBnpclUT0-fjJJDHSJ69Q)～


### 🌟文章目錄🌟

.

<TableOfContents>

- 在使用目錄元件的時候
- 要記得裡面包的是一個 **列表**
- 不要忘記了
- 千萬別忘記了

</TableOfContents>


### 🌟小灰盒🌟

<LittleGreyBox>

想在的小灰盒裡面寫什麼就寫什麼

但如果要分段還是記得要換行啊

跟引言一樣，放[連結](https://ddstoryhub.com)什麼的也是可以的

🌨 🔛 😵 🔡 🙎 ➗ 🍲 🕦 🏒 🍄

</LittleGreyBox>


### 🌟Bookmark🌟

<Bookmark url="https://www.nytimes.com" />

<Bookmark url="https://graphics.reuters.com/" />

<Bookmark url="https://www.scmp.com/infographic/" />

### 🌟圖片🌟

圖片會稍微小小複雜一點，所以先用文字說明一下需要注意的地方：

- `type` 參數總共有4種可以設定，分別是 `base`(預設)、`cover`、`base-text`、`side-by-side`，它會影響圖片的 layout
- `src` 開頭參數的 input 都是 **路徑**，圖片的路徑目前一定要寫成：`../../assets/article/slug名稱/圖片檔名`
- `alt` 開頭的參數都是圖說，跟一般的 img tag 寫法一樣

**👊圖片：一般圖片👊**

如果要使用一般類型的圖片，`type="base"` 會是預設值，所以不用特別填！也可以選擇要不要加上圖說，但要記得 `<Img>` 中的 `/` 要不要加～（直接參考 Markdown 檔案）

<Img alt="一般圖片" src="../../assets/article/guideline/2.png"/>

<Img alt="一般圖片" src="../../assets/article/guideline/2.png">

這邊可以直接寫圖說哦，也可以放[連結](https://ddstoryhub.com)

</Img>


**👊圖片：圖左文右👊**

<Img type="base-text" alt="一般圖片" src="../../assets/article/2021-0606/2.png">

A. 本土確診數暴增，所以大家開始搶著接種疫苗

B. 接種率變高，大家放鬆戒備，恢復人與人的連結，結果確診數增加

</Img>

**👊圖片：在左右兩旁站好👊**

<Img type="side-by-side" 
     srcLeft="../../assets/article/2021-0606/3-left.png" 
     srcRight="../../assets/article/2021-0606/3-right.png"
     altLeft="左邊的 alt"
     altRight="右邊的 alt">

標題修改前後對比

</Img>


**👊圖片：滿版就是讚👊**

<Img type="cover" alt="一般圖片" src="../../assets/article/guideline/2.png"/>


### 😼iframe😼

大家可能會常用一些線上工具作圖，這邊也可以直接使用 `iframe` 的 html code 來嵌入

<iframe width="100%" height="630" frameborder="0"
  src="https://observablehq.com/embed/@syyeo/spike-map-of-taiwan-family-income-2018?cells=chart"></iframe>

---

## 如何從 Medium 搬運文章？

這次上傳部分我會先負責處理，要麻煩各位的是搬運、上稿的部分，步驟如下：

1. 先建立一個以自己 id 為名稱的資料夾
2. 並在這個資料夾中以一開始介紹的檔案結構來放文章進去，所以這個資料夾中會有很多個 `202x-xxxx.md` 檔案和`202x-xxxx` 資料夾，
3. 把 Medium 文章內的圖片下載到對應的 `202x-xxxx` 資料夾中，我試過以滑鼠檔案拖曳的方式可以挺快的，建議圖片的檔名可以重新命名成比較單純的名稱，這可以加速後面的上稿
4. 上稿，以這篇的格式來對這些文章進行上稿，上稿建議可以直接使用 HackMD 來當作編輯器，有一些地方可以做簡單的 debug（例如分段），最後再用 HackMD 右上角的輸出功能，直接把檔案輸出成 `.md` 檔
5. 重複 2-4 的動作後，將以自己 id 名稱命名的資料夾進行壓縮，上傳到[這個空間](https://drive.google.com/drive/u/2/folders/1lFcZFGE3Qoit9xn8i1-bCdePBqbZMHnS)，可能要登入 DD 的 google 帳號～

以上，如果有不清楚的地方，請隨時來問 Steven！最後再次感謝大家！



