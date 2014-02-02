package geb

import geb.util.*

import org.apache.poi.ss.usermodel.*
import org.jggug.kobo.gexcelapi.GExcel
import org.junit.After
import org.junit.Before
import org.junit.Test

class WebUITest {
	def file = "src/test/resources/kdt.xlsx"
	def url = "http://itagakishintaro.github.io/DevNomiTest/pages/index.html"
	Workbook book
	FormulaEvaluator evaluator

	@Before
	void setUp() {
		book = GExcel.open(file)
		evaluator = book.getCreationHelper().createFormulaEvaluator()
	}

	@After
	void tearDown() {
		book = null
		evaluator=null
	}

	@Test
	def void "テストケース1"(){
		KDTcore.kdtByExcel(url, book[1], evaluator)
	}

}

