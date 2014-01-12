package geb

import geb.util.*

import org.apache.poi.ss.usermodel.*
import org.jggug.kobo.gexcelapi.GExcel
import org.junit.After
import org.junit.Before
import org.junit.Test

class WebUITest {

	def file = "src/test/resources/kdt.xlsx"
	def url = "file:///D:/Google%20%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96/%E3%83%87%E3%83%96%E3%83%8E%E3%83%9F/DevNomiHotelError/index.html"
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

