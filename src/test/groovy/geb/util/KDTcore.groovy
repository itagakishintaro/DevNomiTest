package geb.util

import static org.hamcrest.CoreMatchers.*
import static org.hamcrest.Matchers.*
import static org.junit.Assert.*
import static spock.util.matcher.HamcrestSupport.*
import geb.Browser
import geb.spock.GebSpec

import java.text.SimpleDateFormat

import org.apache.poi.ss.usermodel.*

class KDTcore extends GebSpec{
	static final String INPUT = "入力"
	static final String CLICK = "クリック"
	static final String SELECT = "選択"
	static final String ASSERT = "検証"
	static final String REPORT = "記録"
	static final String SLEEP = "停止"
	static final String EQUALE = "と等しい"
	static final String CONTAIN = "を含む"

	def static void kdtByExcel(url, Sheet sheet, FormulaEvaluator evaluator){
		Browser.drive {
			go url
			for(int i=2; sheet["A"+i].value != null; i++){
				def keyword      = sheet["A"+i].value
				def id           = sheet["B"+i].value
				def cellValue    = getEvaluatedValue(sheet["C"+i], evaluator)
				def assertOption = sheet["D"+i].value

				switch(keyword){
					case INPUT:
					println i + "行目：INPUT: " + cellValue + " TO " + id
						$("#"+id).value(cellValue as String)
						break
					case CLICK:
					println i + "行目：CLICK: " + id
						$("#"+id).click()
						break
					case ASSERT:
						expect:
						def actual = $("#"+id).text()
						try{
							assertWithOption(i, actual, cellValue, assertOption)
						}catch(AssertionError e){
							report "error"
							throw e
						}
						break
					case REPORT:
					println i + "行目：REPORT: " + cellValue
						report cellValue
						break
					case SLEEP:
					println i + "行目：SLEEP: " + cellValue
						sleep Integer.parseInt(cellValue)
						break
				}
			}
		}
	}

	private static String getEvaluatedValue(Cell cell, FormulaEvaluator evaluator){
		if(cell.getCellType() == Cell.CELL_TYPE_FORMULA){
			evaluator.evaluateInCell(cell)
		}
		if(cell.getCellType() == Cell.CELL_TYPE_NUMERIC){
			return getFormatedValue(cell)
		}else{
			return cell.value
		}
	}

	private static String getFormatedValue(cell){
		if(DateUtil.isCellDateFormatted(cell)) {
			//日付
			Date date = cell.getDateCellValue()
			SimpleDateFormat df = new SimpleDateFormat("yyyy'年'MM'月'dd'日'")
			return df.format(date)
		} else {
			// 数値
			return cell.numericCellValue as Integer
		}
	}

	private static void assertWithOption(i, actual, cellValue, assertOption){
		switch(assertOption){
			case EQUALE:
			println i + "行目：ASSERT EQUALE: " + cellValue
				assert that(actual, is(cellValue))
				break
			case CONTAIN:
			println i + "行目：ASSERT CONTAIN: " + cellValue
				assert that(actual, containsString(cellValue))
				break
		}
	}
}
